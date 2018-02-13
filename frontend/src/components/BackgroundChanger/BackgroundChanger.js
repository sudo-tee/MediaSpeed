import {Component} from 'react';

class BackgroundChanger extends Component {
    constructor() {
        super(...arguments);
        this.handle = null;
        this.state = {
            img: null
        }
    }

    componentWillMount() {
        this.changeBackground(this.props['medias'])
    }

    componentWillReceiveProps(newProps) {
        if(newProps['medias'] !== this.props['medias'])
            this.changeBackground(newProps['medias']);
    }

    componentWillUnmount() {
        clearTimeout(this.handle);
    }

    changeBackground(medias) {

        clearTimeout(this.handle);

        const currentMedia = (Array.isArray(medias)) ? medias : [medias];
        const images = currentMedia.map((media) => media.local_backdrop);
        this.setImage(images);
    }

    render() {
        const {img} = this.state;
        const rootElement = document.querySelector(this.props['root-element']);
        rootElement.style.background = img;
        return '';
    }

    setImage(images) {

        const base = "/images/";
        const randomItem = images[Math.floor(Math.random() * images.length)];

        if (!randomItem) return;

        const img = new Image();
        img.src = base + randomItem;
        img.onload =  () => {
            this.setState({img:"url(" + base + randomItem + ") no-repeat fixed"});
        };
        this.handle = setTimeout(() => this.setImage(images), (this.props['delay'] || 5) * 1000);

    }
}

export default BackgroundChanger;
