const imagesLinks = [
    'sw.jpeg',
    'st.jpeg',
    'sg.jpeg'
];


let currentSlide = 0;
const slideCount = imagesLinks.length;
let imageWidth;
let isSliding = false;
let playIntervalId;
const playTime = 2;
let touchStartX;
const touchSensitivity = 50;



const slidesElement = document.querySelector('#slider .slides');
const nextElement = document.querySelector('#slider .controls .next');
const prevElement = document.querySelector('#slider .controls .prev');
const slidesContainerElement = document.querySelector('#slider .slides');
const indicatorsContainerElement = document.querySelector('#slider .indicators');
const playElement = document.querySelector('#slider .play-btn');

generateImg();
generateIndicators();

const firstImageElement = document.querySelector('#slider .slides img');
imageWidth = firstImageElement.offsetWidth;



const sliderProportions = firstImageElement.offsetHeight / firstImageElement.offsetWidth;
slidesElement.style.height = `${slidesElement.offsetWidth * sliderProportions}px`

nextElement.addEventListener('click', toNextClick);
prevElement.addEventListener('click', toPrevClick);
indicatorsContainerElement.addEventListener('click', onIndicatorClick);
playElement.addEventListener('click', playPauseSlides);
document.body.addEventListener('keydown', sliderKeyboard);
slidesContainerElement.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
})
slidesContainerElement.addEventListener('touchend', touchSliderMovement);


function generateImg() {
    let resultHtml = '';
    imagesLinks.forEach(imageLink => {
        resultHtml += `<img src="images/slider/${imageLink}" alt="">`;
    })
    slidesContainerElement.innerHTML = resultHtml;
}

function generateIndicators() {
    let resultHtml = '';
    imagesLinks.forEach((imageLink, index) => {
        if (index === 0) {
            resultHtml += `<button class="indicator active" data-img-number="${index}" type="button"></button>`;
        }
        else {
            resultHtml += `<button class="indicator" data-img-number="${index}" type="button"></button>`;
        }
    })
    indicatorsContainerElement.innerHTML = resultHtml;
}

function toNextClick() {
        currentSlide++;
    if (currentSlide === slideCount) {
        currentSlide = 0;
    }
    slidesContainerElement.style.transform = `translate(-${currentSlide * imageWidth}px)`;
    refreshIndicators();
}


function toPrevClick() {
    currentSlide--;
    if (currentSlide < 0) {
        currentSlide = slideCount - 1;
    }
    slidesContainerElement.style.transform = `translate(-${currentSlide * imageWidth}px)`;
    refreshIndicators();
}

function onIndicatorClick(event) {
    if (!event.target.classList.contains('indicator')) {
        return;
    }
    currentSlide = event.target.dataset.imgNumber;
    slidesContainerElement.style.transform = `translate(-${currentSlide * imageWidth}px)`;
    refreshIndicators();
}

function sliderKeyboard (event) {
    if (event.key === 'ArrowRight') {toNextClick()}
    if (event.key === 'ArrowLeft') {toPrevClick()}
    if (event.key === ' ') {playPauseSlides();}
}

function touchSliderMovement(event) {
    if (event.changedTouches[0].clientX < touchStartX - touchSensitivity) {
        toNextClick()
    }
    if (event.changedTouches[0].clientX > touchStartX + touchSensitivity) {
        toPrevClick()
    }
}

function refreshIndicators() {
    const activeIndicator = document.querySelector('#slider .active');
    if (activeIndicator) {
        activeIndicator.classList.remove('active');
    }
    document.querySelector(`#slider button[data-img-number="${currentSlide}"]` ).classList.add('active');
}

function playPauseSlides() {
    if(isSliding) {
        playElement.innerHTML = '&#9654;';
        clearInterval(playIntervalId);
        playIntervalId = null;
    }
    else {
        playElement.innerHTML = '&#10074;&#10074;';
        playIntervalId = setInterval(() => toNextClick(), playTime * 1000);
    }
    isSliding = !isSliding;
    playElement.classList.toggle('paused');
}



