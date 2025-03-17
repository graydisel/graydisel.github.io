export class FindingMovie {
    API_KEY = 'c3efcca6';
    BASE_URL = 'https://www.omdbapi.com/';

    constructor() {

        this.resultsContainerElement = document.getElementById('results-container');
        this.errorContainerElement = document.getElementById('error-container');
        this.searchButtonElement = document.getElementById('searchButton');
        this.searchTextElement = document.getElementById('searchText');

        this.searchButtonElement.addEventListener('click', this.init.bind(this))
        this.debounceInit = this.debounce(this.init.bind(this), 500);
        this.searchTextElement.addEventListener('input', this.debounceInit);

    }

    async getMovie(link) {
        const movieData = await fetch(link)
            .then(res => res.json())
            .then(res => {
                if (res.Response === 'False') {
                    throw new Error(res.Error);
                }
                return res;
            });

        return movieData?.Search;
    }

    async init() {
        this.resultsContainerElement.innerHTML = '';
        this.resultsContainerElement.style.display = 'none';
        this.errorContainerElement.style.display = 'none';
        this.errorContainerElement.innerHTML = '';
        const searchString = this.searchTextElement.value.trim();
        this.searchLink = `${this.BASE_URL}?s=${searchString}&apikey=${this.API_KEY}`;

        if (!searchString) {
            this.errorContainerElement.style.display = 'block';
            this.errorContainerElement.innerHTML = 'Search string is empty';
            return;
        }
        try {
            const movieResults = await this.getMovie(this.searchLink);
            this.generateMovies(movieResults);
        } catch (error) {
            this.errorContainerElement.style.display = 'block';
            this.resultsContainerElement.style.display = 'none';
            console.log(error);
            this.errorContainerElement.innerHTML = error.message;

        }
    }

     generateMovies(movieData) {

         movieData.forEach((item) => {
                const imgUrl = item.Poster?.startsWith('http') ? item.Poster : 'images/logo/no_image.svg';
                this.resultsContainerElement.innerHTML +=
                    `<div class="result-item">
                        <h2>${item.Title}</h2>
                        <img src="${imgUrl}" alt="Film Poster">
                        <p>Type: ${item.Type.charAt(0).toUpperCase() + item.Type.slice(1)}</p>
                        <p>Year: ${item.Year}</p>
                    </div>`;
         });
         this.resultsContainerElement.style.display = 'grid';
     }

    debounce(callback, wait) {
        let timer;
        return function(...args) {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                clearTimeout(timer);
                callback(...args);
            }, wait);
        }
    }

}