window.onload = function() {
  $("#accordion").accordion();
};

var myImage = document.getElementById("effet");
var imageArray = [
  "./img/ROILION.jpg",
  "./img/X-MEN.jpg",
  "./img/PARASITE.jpg",
  "./img/TOYSTORY4.jpg",
  "./img/X-MEN.jpg",
  "./img/YESTERDAY.jpg",
  "./img/SPIDERMAN.jpg"
];
var imageIndex = 0;
function changeImage() {
  myImage.setAttribute("src", imageArray[imageIndex]);
  imageIndex++;
  if (imageIndex >= imageArray.length) {
    imageIndex = 0;
  }
}

var imageInterval = setInterval(changeImage, 5000);

myImage.onmouseover = function() {
  clearInterval(imageInterval);
};

myImage.onmouseout = function() {
  imageInterval = setInterval(changeImage, 3000);
};

$(function() {
  $("#formSearch").on("submit", e => {
    e.preventDefault();
    let search = $("#search").val();
    getMovies(search);
  });
});

function openModal(id) {
  $("#modal").css("display", "block");
  $.ajax({
    url: "https://www.omdbapi.com/?apikey=74556bd0&i=" + id,
    success: function(detailMovie) {
      console.log(detailMovie);
      const detailMovieList = $("#modal-content");
      const detailMovieElement = $("<div></div>").addClass("modal");
      const detailMoviePoster = $("<img>")
        .attr("src", `${detailMovie.Poster}`)
        .addClass("Zimg");
      const detailMovieActors = $(`<h3>Acteurs : ${detailMovie.Actors}</h3>`);
      const detailMovieGenre = $(`<h3>Genre : ${detailMovie.Genre}</h3>`);
      const detailMovieimdbRating = $(
        `<h3>Note: ${detailMovie.imdbRating}</h3>`
      );
      const detailMovieRuntime = $(`<h3>Durée: ${detailMovie.Runtime}</h3>`);
      const detailMovieDirector = $(
        `<h3>Réalisateur : ${detailMovie.Director}</h3>`
      );
      const button = $("<button>Official Page</button>")
        .on("click", () => {
          window.location.href = detailMovie.Website;
        })
        .addClass("betn");
      detailMovieElement.append(detailMovieActors);
      detailMovieElement.append(detailMoviePoster);
      detailMovieElement.append(detailMovieGenre);
      detailMovieElement.append(detailMovieimdbRating);
      detailMovieElement.append(detailMovieRuntime);
      detailMovieElement.append(detailMovieDirector);
      detailMovieElement.append(button);
      detailMovieList.append(detailMovieElement);
    }
  });
}
var span = document.getElementsByClassName("close")[0];
span.onclick = function() {
  modal.style.display = "none";
  $("#modal-content").empty();
};

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    $("#modal-content").empty();
  }
};

function getMovies(search) {
  if (search == "") {
    alert("Veuillez entrer un titre de film");
  } else {
    // récupérer valeur select
    const select = $("#select").val();
    $.ajax({
      url:
        "https://www.omdbapi.com/?apikey=74556bd0&s=" +
        search +
        "&type=" +
        select,
      success: function(response) {
        if (
          response.Response == "False" &&
          response.Error == "Movie not found!"
        ) {
          alert("Veuillez entrer un titre valide");
        } else if (
          response.Response == "False" &&
          response.Error == "Invalid API key!"
        ) {
          alert("Votre clé API n'est pas valide");
        } else {
          console.log(response);
          let movies = response.Search;
          const movieList = $("#movieList");
          movieList.empty();
          $.each(movies, function(index, movie) {
            const accordion = $("#accordion");
            accordion.empty();
            const space = $("#space");
            space.empty();
            const movieElement = $("<div></div>");
            const movieTitle = $(`<h2>${movie.Title}</h2>`);
            const movieYear = $(`<h3>${movie.Year}</h3>`);
            const moviePoster = $("<img>")
              .attr("src", movie.Poster)
              .attr("alt", "");
            if (movie.Poster == "N/A") {
              moviePoster.attr("alt", "image non disponible");
            }
            const movieSpace = $("<br>");
            const moreButton = $("<button></button>")
              .on("click", () => {
                openModal(movie.imdbID);
              })
              .addClass("btn")
              .html("Détails du film");
            movieElement.append(movieTitle);
            movieElement.append(movieYear);
            movieElement.append(moviePoster);
            movieElement.append(movieSpace);
            movieElement.append(moreButton);
            movieList.append(movieElement);
          });
          $("#search").val("");
        }
      }
    });
  }
}

