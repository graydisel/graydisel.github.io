export class Slider {
    currentSlide = 0;
    isSliding = false;
    playIntervalId;
    playTime;
    touchStartX;
    touchSensitivity = 50;


    constructor(params) {
        if (!params.images || !params.images.length || !Array.isArray(params.images)) {
            throw new Error('No images specified');
        }
        if (!params.sliderId) {
            throw new Error('Slider ID required!');
        }

        const defaultOptions = {
            sliderId: '',
            images: [],
            playTime: 3,
            isIndicatorsHidden: false
        }

        const options = {
            ...defaultOptions,
            ...params};

        this.sliderId = `#${options.sliderId}`;
        this.images = options.images;
        this.slideCount = options.images.length;
        this.playTime = options.playTime;
        this.isIndicatorsHidden = options.isIndicatorsHidden;

        this.prepareElements();
        this.makeSubscriptions();
    }

    prepareElements() {
        this.slidesContainerElement = document.querySelector(`${this.sliderId} .slides`);
        this.indicatorsContainerElement = document.querySelector(`${this.sliderId} .indicators`);
        this.playElement = document.querySelector(`${this.sliderId} .play-btn`);

        this.generateImg();
        if (!this.isIndicatorsHidden) {
            this.generateIndicators();
        }

        this.firstImageElement = document.querySelector(`${this.sliderId} .slides img`);
    }

    makeSubscriptions() {
        const nextArrow = document.querySelector(`${this.sliderId} .controls .next`);
        if (nextArrow) {
            nextArrow.addEventListener('click', this.toNextClick.bind(this));
        }
        const prevArrow = document.querySelector(`${this.sliderId} .controls .prev`);
        if (prevArrow) {
            prevArrow.addEventListener('click', this.toPrevClick.bind(this));
        }
        if (!this.isIndicatorsHidden) {
            this.indicatorsContainerElement.addEventListener('click', event => {
                this.onIndicatorClick(event);
            });
        }
        if(this.playElement) {
            this.playElement.addEventListener('click', this.playPauseSlides.bind(this));
            document.body.addEventListener('keydown', event => {
                this.sliderKeyboard(event);
            });
        }
        this.slidesContainerElement.addEventListener('touchstart', (event) => {
            this.touchStartX = event.touches[0].clientX;
        });
        this.slidesContainerElement.addEventListener('touchend', event =>  {
            this.touchSliderMovement(event);
        });

    }

    generateImg() {
        let resultHtml = '';
        this.images.forEach(imageLink => {
            resultHtml += `<img src="images/slider/${imageLink}" alt="">`;
        })
        this.slidesContainerElement.innerHTML = resultHtml;
    }

    generateIndicators() {
        let resultHtml = '';
        this.images.forEach((imageLink, index) => {
            if (index === 0) {
                resultHtml += `<button class="indicator active" data-img-number="${index}" type="button"></button>`;
            }
            else {
                resultHtml += `<button class="indicator" data-img-number="${index}" type="button"></button>`;
            }
        })
        this.indicatorsContainerElement.innerHTML = resultHtml;
    }


    refreshIndicators() {
        if (this.isIndicatorsHidden) {
            return;
        }
        const activeIndicator = document.querySelector('#slider .active');
        if (activeIndicator) {
            activeIndicator.classList.remove('active');
        }
        document.querySelector(`${this.sliderId} button[data-img-number="${this.currentSlide}"]` ).classList.add('active');
    }

    toNextClick() {
        this.currentSlide++;
        if (this.currentSlide === this.slideCount) {
            this.currentSlide = 0;
        }
        this.slidesContainerElement.style.transform = `translate(-${this.currentSlide * this.firstImageElement.offsetWidth}px)`;
        this.refreshIndicators();
    }

    toPrevClick() {
        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.slideCount - 1;
        }
        this.slidesContainerElement.style.transform = `translate(-${this.currentSlide * this.firstImageElement.offsetWidth}px)`;
        this.refreshIndicators();
    }

    onIndicatorClick(event) {
        if (!event.target.classList.contains('indicator')) {
            return;
        }
        this.currentSlide = event.target.dataset.imgNumber;
        this.slidesContainerElement.style.transform = `translate(-${this.currentSlide * this.firstImageElement.offsetWidth}px)`;
        this.refreshIndicators();
    }

    sliderKeyboard (event) {
        if (event.key === 'ArrowRight') {
            this.toNextClick()
        }
        if (event.key === 'ArrowLeft') {
            this.toPrevClick()
        }
        if (event.key === ' ') {
            this.playPauseSlides()
        }
    }

    touchSliderMovement(event) {
        if (event.changedTouches[0].clientX < this.touchStartX - this.touchSensitivity) {
            this.toNextClick()
        }
        if (event.changedTouches[0].clientX > this.touchStartX + this.touchSensitivity) {
            this.toPrevClick()
        }
    }

    playPauseSlides() {
        if(this.isSliding) {
            this.playElement.innerHTML = '&#9654;';
            clearInterval(this.playIntervalId);
            this.playIntervalId = null;
        }
        else {
            this.playElement.innerHTML = '&#10074;&#10074;';
            this.playIntervalId = setInterval(() => this.toNextClick(), this.playTime * 1000);
        }
        this.isSliding = !this.isSliding;
        this.playElement.classList.toggle('paused');
    }
}