const BASE_URL = "https://movie-list.alphacamp.io/"
const INDEX_URL = BASE_URL + "/api/v1/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const movies = []

const dataPanel = document.querySelector("#data-panel")
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector("#search-input")
const resultsTextBox = document.querySelector("#results-text")

let filteredMovies = []
const moviesArr = filteredMovies.length ? filteredMovies : movies

let currentPage = 1
let currentMode = dataPanel.dataset.mode

////////////

function renderMovieList(data) {
  if (currentMode === "poster-mode") {
    let rawHTML = ""
    data.forEach((item) => {
      rawHTML +=
        `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      </div>`
    })
    dataPanel.innerHTML = rawHTML
  } else if (currentMode === "list-mode") {


    let rawHTML = `<ul class="list-group col-sm-12 mb-2">`
    data.forEach((item) => {
      rawHTML += `
      <li class="list-group-item d-flex justify-content-between list-group-item-action">
        <h5 class="card-title">${item.title}</h5>
        <div>
              <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
        </div>
      </li>`
    })
    rawHTML += "</ul>"
    dataPanel.innerHTML = rawHTML
  }

}

function showMovieModal(id) {
  const modalTitle = document.querySelector("#modal-title")
  const modalImg = document.querySelector("#movie-modal-img")
  const modalDate = document.querySelector("#movie-modal-date")
  const modalDescription = document.querySelector("#movie-modal-description")

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImg.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fluid">`
  })
}

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || []
  const movie = movies.find((movie) => movie.id === id)
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中！")
  } else {
    list.push(movie)
    localStorage.setItem("favoriteMovies", JSON.stringify(list))
  }
}

//遞交search搜尋
searchForm.addEventListener("submit", function onSearch(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  //把搜尋結果放入filteredMovies
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword))

  if (!keyword.length) {
    return alert("請輸入有效字串！")

    //搜尋結果，若無符合項目產生‘noMatchedResults’
  } else if (filteredMovies === [] || !filteredMovies.length) {

    let rawHTML = `<h3 class="font-monospace mt-3 mb-3">Sorry</h3>
    <h4 class="font-monospace lh-lg mt-3">Can't find anything<br>with keyword: ${keyword}</h4>
    `
    dataPanel.innerHTML = rawHTML
    resultsTextBox.innerHTML = ''
    dataPanel.dataset.mode = "no-matched-results"
    renderPaginator(0)

    //有搜尋結果（產生關鍵字搜尋結果+依照模式render頁面）
  } else {
    let rawHTML = `<h5 class="font-monospace lh-lg mb-4">Here's results for "${keyword}" :</h5>`
    resultsTextBox.innerHTML = rawHTML
    dataPanel.innerHTML = ''
    changeDisplayModel(currentMode)
    renderMovieList(getDataByPage(currentPage))
    renderPaginator(filteredMovies.length)

  }

  searchInput.value = ''
})

/////////////////////////////////

//點擊卡片（show more/加入最愛）
dataPanel.addEventListener("click", function onPanelClick(event) {
  let movieId = parseInt(event.target.dataset.id)

  if (event.target.matches(".btn-show-movie")) {
    showMovieModal(movieId)
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(movieId)
  }
})

//點擊分頁器
paginator.addEventListener("click", function onPaginatorClicked(event) {
  //如果被點擊的不是 a 標籤，結束
  if (event.target.tagName !== "A") return

  //透過 dataset 取得被點擊的頁數
  const page = Number(event.target.dataset.page)
  currentPage = page
  console.log(currentPage)
  renderMovieList(getDataByPage(currentPage))

})

// pagination 分頁器
const MOVIES_PER_PAGE = 12

function getDataByPage(page) {
  //只要filertedMovies裡面有東西的話，就只會render搜尋結果的資料
  const moviesArr = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return moviesArr.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(holeAmount) {

  const numberOfPages = Math.ceil(holeAmount / MOVIES_PER_PAGE)
  let rawHTML = ""
  if (holeAmount !== 0) {
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
  }
  paginator.innerHTML = rawHTML
}

//模式（poster mode/list mode)
const modePanel = document.querySelector("#mode-panel")
const listMode = document.querySelector("#list-mode")
const posterMode = document.querySelector("#poster-mode")


function changeDisplayModel(displayMode) {
  if (dataPanel.dataset.mode === displayMode) return
  dataPanel.dataset.mode = displayMode
  currentMode = dataPanel.dataset.mode

  if (currentMode === "list-mode") {
    listMode.classList.add("fa-active")
    posterMode.classList.remove("fa-active")
  } else if (currentMode === "poster-mode") {
    posterMode.classList.add("fa-active")
    listMode.classList.remove("fa-active")
  }
}

//點擊 瀏覽模式（poster mode/list mode)
modePanel.addEventListener("click", function onModeClick(event) {
  if (dataPanel.dataset.mode === "no-matched-results") return
  if (event.target.matches("#list-mode")) {
    changeDisplayModel("list-mode")
  } else if (event.target.matches("#poster-mode")) {
    changeDisplayModel("poster-mode")
  }
  const moviesArr = filteredMovies.length ? filteredMovies : movies
  renderMovieList(getDataByPage(currentPage))
  renderPaginator(moviesArr.length)
})

/////////////////////////////////

//API抓取


axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(getDataByPage(currentPage))
    renderPaginator(movies.length)
  })
  .catch((err) => console.log(err))

