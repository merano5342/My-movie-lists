const BASE_URL = "https://movie-list.alphacamp.io/";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const movies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

const filteredMovies = [];

let currentPage = 1;
let currentMode = "poster"; //or "list"

////////////

function renderMovieByPosterMode(data) {
  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
        <div class="card-body">
          <h5 class="card-title">${item.title}</h5>
        </div>
        <div class="card-footer">
          <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id
      }">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id
      }">+</button>
        </div>
      </div>
    </div>
  </div>`;
  });
  dataPanel.innerHTML = rawHTML;
}

function renderMovieByListMode(data) {
  let tableHTML = `
  <table class="table" id="list-mode-table">
    <thread>

    </thread>
  </table>
  `;
  dataPanel.innerHTML = tableHTML;
  const listModeTable = document.querySelector("#list-mode-table");

  let rawHTML = "";
  data.forEach((item) => {
    rawHTML += `
      <tr>
        <th scope="row" class="justify-content-end">${item.title}</th>
        <th>
          
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal"
              data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
          
        </th>
      </tr>`;
  });
  listModeTable.innerHTML = rawHTML;
}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#modal-title");
  const modalImg = document.querySelector("#movie-modal-img");
  const modalDate = document.querySelector("#movie-modal-date");
  const modalDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results;
    modalTitle.innerText = data.title;
    modalDate.innerText = data.release_date;
    modalDescription.innerText = data.description;
    modalImg.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`;
  });
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！");
  } else {
    list.push(movie);
    localStorage.setItem("favoriteMovies", JSON.stringify(list));
  }
}

//遞交search搜尋
searchForm.addEventListener("submit", function onSearch(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();

  //把搜尋結果放入filteredMovies
  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie);
    }
  }

  if (!keyword.length) {
    return alert("請輸入有效字串！");
  }

  renderMovieByMode(currentMode);
  renderPaginator(filteredMovies.length);
});

/////////////////////////////////

//點擊卡片（show more/加入最愛）
dataPanel.addEventListener("click", function onPanelClick(event) {
  let movieId = parseInt(event.target.dataset.id);

  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(movieId);
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(movieId);
  }
});

//點擊分頁器
paginator.addEventListener("click", function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return;

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page);
  currentPage = page;
  if (currentMode === "list") {
    renderMovieByListMode(getDataByPage(currentPage));
  } else if (currentMode === "poster") {
    renderMovieByPosterMode(getDataByPage(currentPage));
  }
});

// pagination 分頁器
const MOVIES_PER_PAGE = 12;

function getDataByPage(page) {
  //只要filertedMovies裡面有東西的話，就只會render搜尋結果的資料
  const moviesArr = filteredMovies.length ? filteredMovies : movies;

  const startIndex = (page - 1) * MOVIES_PER_PAGE;
  return moviesArr.slice(startIndex, startIndex + MOVIES_PER_PAGE);
}

function renderPaginator(holeAmount) {
  const numberOfPages = Math.ceil(holeAmount / MOVIES_PER_PAGE);
  let rawHTML = "";
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`;
  }
  paginator.innerHTML = rawHTML;
}

//點擊瀏覽模式（poster mode/list mode)
const modePanel = document.querySelector("#mode-panel");
const listMode = document.querySelector("#list-mode");
const posterMode = document.querySelector("#poster-mode");

function changeModeCss() {
  if (currentMode === "list") {
    listMode.classList.add("fa-active");
    posterMode.classList.remove("fa-active");
  } else if (currentMode === "poster") {
    posterMode.classList.add("fa-active");
    listMode.classList.remove("fa-active");
  }
}

modePanel.addEventListener("click", function onModeClick(event) {
  if (event.target.matches("#list-mode")) {
    currentMode = "list";
  } else if (event.target.matches("#poster-mode")) {
    currentMode = "poster";
  }
  changeModeCss();
  renderMovieByMode(currentMode);
  renderPaginator(filteredMovies.length);
});

/////////////////////////////////

//API抓取

function renderMovieByMode(currentMode) {
  if (currentMode === "list") {
    renderMovieByListMode(getDataByPage(currentPage));
  } else if (currentMode === "poster") {
    renderMovieByPosterMode(getDataByPage(currentPage));
  }
}

axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results);

    renderMovieByMode(currentMode);
    renderPaginator(movies.length);
  })
  .catch((err) => console.log(err));
