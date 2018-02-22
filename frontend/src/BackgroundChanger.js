const BackgroundChanger = ({media, rootElement}) => {
    if (!media) return '';

    const base = "/images/";
    let image = media.local_backdrop || media.local_still || media.local_screenshot || media.local_poster;
    image = image ? base + image : '/img/default-bg.jpg';

    const img = new Image();
    img.src = image;
    img.onload =  () => {
        const element = document.querySelector(rootElement);
        element.style.background = "url(" + image + ") no-repeat fixed";
    };
    return '';
};

export default BackgroundChanger;
