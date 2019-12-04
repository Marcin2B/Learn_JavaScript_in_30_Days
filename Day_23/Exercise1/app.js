(function () {
    const form = document.querySelector('#search-form');
    const searchField = document.querySelector('#search-keyword');
    let searchedForText;
    const responseContainer = document.querySelector('#response-container');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        responseContainer.innerHTML = '';
        searchedForText = searchField.value;

        // Call for Images
        const imgRequest = new XMLHttpRequest();
        imgRequest.onload = addImage;
        imgRequest.onerror = function(err) {
            requestError(err, 'image');
        };
        imgRequest.open('GET', `https://api.unsplash.com/search/photos?page=1&query=${searchedForText}`);
        // Make sure you add your Client-ID
        imgRequest.setRequestHeader('Authorization', 'Client-ID <your-client-id>');
        imgRequest.send();

        // Call for Articles
        const articleRequest = new XMLHttpRequest();
        articleRequest.onload = addArticles;
        articleRequest.onerror = function(err) {
            requestError(err, 'articles');
        };
        // Make sure you add your API key
        articleRequest.open('GET', `http://api.nytimes.com/svc/search/v2/articlesearch.json?q=${searchedForText}&api-key=<your-API-key-goes-here>`);
        articleRequest.send();
    });
})();


// Adding The Images
function addImage() {
    let htmlContent = "";
    const data = JSON.parse(this.responseText);

    if (data && data.results && data.results[0]) {
        const firstImage = data.results[0];
        htmlContent = `<figure>
            <img src="${firstImage.urls.regular}" alt="${searchedForText}">
            <figcaption>${searchedForText} by ${firstImage.user.name}</figcaption>
        </figure>`;
    } else {
        htmlContent = '<div class="error-no-image">No Images Available</div>';
    }
    responseContainer.insertAdjacentHTML('afterbegin', htmlContent);
}


// Adding The Articles
function addArticles() {
    let htmlContent = "";
    const data = JSON.parse(this.responseText);

    if (data.response && data.response.docs && data.response.docs.length > 1) {
        htmlContent = '<ul>' + data.response.docs.map(article => `<li class="article">
            <h2><a href="${article.web_url}">${article.headline.main}</a></h2>
            <p>${article.snippet}</p>
        </li>`
        ).join('') + '</ul>';
    } else {
        htmlContent = '<div class="error-no-articles">No Articles Available</div>';
    }
    responseContainer.insertAdjacentHTML('beforeend', htmlContent);
}

function requestError(e, part) {
    console.log(e);
    responseContainer.insertAdjacentHTML('beforeend', `<p class="network-warning">Oh no! There was an error making a request for the ${part}.</p>`);
}
