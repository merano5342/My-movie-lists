const BASE_URL = "https://movie-list.alphacamp.io/"
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies')) || []

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

let currentMode = dataPanel.dataset.mode

function renderMovieList(data) {
  if (currentMode === "poster-mode") {
    let rawHTML = ""
    data.forEach((item) => {
      rawHTML += `<div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img src="${POSTER_URL + item.image
        }" class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-modal" data-id="${item.id}">More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
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

  const movie = movies.find((movie) => movie.id === id)

  modalTitle.innerText = movie.title
  modalDate.innerText = movie.release_date
  modalDescription.innerText = movie.description
  modalImg.innerHTML = `<img src="${POSTER_URL + movie.image
    }" alt="movie-poster" class="img-fluid">`

}


function removeFromFavorite(id) {
  const movieIndex = movies.findIndex((movie) => movie.id === id)
  movies.splice(movieIndex, 1)

  localStorage.setItem('favoriteMovie', JSON.stringify(movies))

  renderMovieList(movies)
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
  // if (dataPanel.dataset.mode === "no-matched-results") return
  if (event.target.matches("#list-mode")) {
    changeDisplayModel("list-mode")
  } else if (event.target.matches("#poster-mode")) {
    changeDisplayModel("poster-mode")
  }

  renderMovieList(movies)

})



renderMovieList(movies)




//監聽器
dataPanel.addEventListener('click', function onPanelClick(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModal(parseInt(event.target.dataset.id))

  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(parseInt(event.target.dataset.id))
  }
})


