$('.btn-movie-name').on('click', () => getSearchMovie());

$('.data-input-user').keypress(function (event) {
    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        getSearchMovie();
    }
});

$('close-button-modal').on('click', function () {
    $('.modal-body').html('')
});

function getDataMovie(dataSearch) {
    console.log("Data Get: " + dataSearch);
    $.ajax({
        url: 'http://www.omdbapi.com/?apikey=ae63e0b5&s=' + dataSearch + '&page=' + pageNow,
        success: result => {
            let cards = '';
            let resultsValue = Math.ceil(result.totalResults / 10);
            console.log("Result Value = " + resultsValue);
            console.log("Page Now : " + pageNow);
            const movies = result.Search;
            if (movies) {
                movies.forEach(m => {
                    cards += showMovie(m);
                });
                $('.movie-container').html(cards);
                if (resultsValue > 1) {
                    $('.pagination-page').html(showPaginate);
                } else {
                    $('.pagination-page').html('');
                }
            } else {
                alert(result.Error);
            }

            $('.modal-detail-button').on('click', function () {
                $.ajax({
                    url: 'http://www.omdbapi.com/?apikey=ae63e0b5&i=' + $(this).data('imdbid'),
                    success: m => {
                        const detailMovie = showDetailMovie(m);
                        $('.modal-body').html(detailMovie);
                    },
                    error: (error) => {
                        alert(error.responseJSON.Error);
                    }
                });
            })

            if (pageNow > 1) {
                $('#page-previous').on('click', function () {
                    pageNow--;
                    console.log("Page - Now : " + pageNow);
                    getSearchMovie();
                });
            }
            if (pageNow < resultsValue) {
                $('.page-next').on('click', function () {
                    pageNow++;
                    console.log("Page + Now: " + pageNow);
                    getSearchMovie();
                });
            }
        },
        error: (e) => {
            alert(e.responseJSON.Error);
        }
    });
}

function getSearchMovie() {
    let dataSearch = $('.data-input-user').val();
    if (oldData !== dataSearch) {
        oldData = dataSearch;
        pageNow = 1;
        console.log("New data : " + oldData);
        getDataMovie(dataSearch);
    } else {
        console.log("Old DAta: " + oldData);
        getDataMovie(oldData);
    }
}

function showMovie(m) {
    return `<div class="col-md-4 my-3 mb-2">
                <div class="card">
                    <img src="${m.Poster === 'N/A' ? imageNotfound : m.Poster}" class="card-img-top" alt="..." style="height: 10cm;">
                    <div class="card-body">
                        <h5 class="card-title">${m.Title}</h5>
                        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#detailMovie" data-imdbid="${m.imdbID}">View More</a>
                    </div>
                </div>
            </div>`;
}

function showDetailMovie(m) {
    return `<div class="container-fluid">
                <div class="row">
                    <div class="col-md-4">
                        <img src="${m.Poster === 'N/A' ? imageNotfound : m.Poster}" class="img-fluid" alt="...">
                    </div>
                    <div class="col-md">
                        <ul class="list-group">
                            <li class="list-group-item"><h4>${m.Title}</h4></li>
                            <li class="list-group-item"><strong>Year: </strong>${m.Year}</li>
                            <li class="list-group-item"><strong>Relased: </strong>${m.Released}</li>
                            <li class="list-group-item"><strong>Genre: </strong>${m.Genre}</li>
                            <li class="list-group-item"><strong>Plot: </strong><br>${m.Plot}</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

function showPaginate() {
    return `<nav aria-label="Page navigation example">
                <ul class="pagination justify-content-center">
                <li class="page-item">
                    <a class="page-link" id="page-previous">Previous</a>
                </li>
                <li class="page-item active"><a class="page-link page-content-count" href="#">${pageNow}</a></li>
                <li class="page-item page-next">
                    <a class="page-link">Next</a>
                </li>
                </ul>
            </nav>`
}



const imageNotfound = "https://static.vecteezy.com/system/resources/previews/005/337/799/original/icon-image-not-found-free-vector.jpg"
let pageNow = 1;
let oldData = "";