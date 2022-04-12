const BASE_URL = "https://movie-list.alphacamp.io/"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

function renderMovieList(data) {

  let rawHTML = ''
  data.forEach((item) => {
    // title, image
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
      <div class="card">
        <img src="${POSTER_URL + item.image
      }" class="card-img-top" alt="Movie Poster">
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
}

function showMovieModal(id) {
  const modalTitle = document.querySelector('#modal-title')
  const modalImg = document.querySelector('#movie-modal-img')
  const modalDate = document.querySelector('#movie-modal-date')
  const modalDescription = document.querySelector('#movie-modal-description')

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data.results
    modalTitle.innerText = data.title
    modalDate.innerText = data.release_date
    modalDescription.innerText = data.description
    modalImg.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
  })


}


searchForm.addEventListener('submit', function onSearch(event) {
  //取消預設事件
  // 連擊 a 元素時會連向新的網頁； * 點擊 form 裡的 input[type="submit"] 或 button[type="submit"] 時，也會自動跳頁，並且將表單內容提交給遠端伺服器 (如果有設定 method 和 action 屬性的話，沒有設定 action 則會重新導向當前頁面)
  event.preventDefault()
  //取得搜尋關鍵字
  const keyword = searchInput.value.trim().toLowerCase()
  //儲存符合篩選條件的項目
  let filteredMovies = []

  for (const movie of movies) {
    if (movie.title.toLowerCase().includes(keyword)) {
      filteredMovies.push(movie)
    }
  }

  //錯誤處理：輸入無效字串
  if (!keyword.length) {
    return alert('請輸入有效字串！')
  }
  //條件篩選
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  )
  //重新輸出至畫面
  renderMovieList(filteredMovies)
})


dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(parseInt(event.target.dataset.id))
  }
})


axios
  .get(INDEX_URL)
  .then((response) => {
    movies.push(...response.data.results)
    renderMovieList(movies)
  })
  .catch((err) => console.log(err))
