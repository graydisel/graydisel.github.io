import {Slider} from "./Slider.js";

const imagesLinks = [
    'sw.jpeg',
    'st.jpeg',
    'sg.jpeg'
];

const slider = new Slider({
    sliderId: 'slider',
    images: imagesLinks,
    playTime: 3,
});



