import React, {Component} from 'react';


class BackgroundChanger extends Component {
    constructor() {
        super(...arguments);
        this.handle = null;
        this.state = {
            img: null
        }
    }

    componentWillMount() {
        console.log('mount', this.props['medias']);

        this.changeBackground(this.props['medias'])
    }

    componentWillReceiveProps(newProps) {
        console.log('props', newProps['medias']);

        if(newProps['medias'] !== this.props['medias'])
            this.changeBackground(newProps['medias']);
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
        console.log(rootElement);
        rootElement.style.background = img;
        return '';//<div id="background-image" style={{background: img}}></div>;
    }

    setImage(images) {

        const base = "/images/";
        const randomItem = images[Math.floor(Math.random() * images.length)];

        const img = new Image();
        img.src = base + randomItem;
        img.onload =  () => {
            console.log('yo', randomItem);
            this.setState({img:"url(" + base + randomItem + ") no-repeat fixed"});
        };
        this.handle = setTimeout(() => this.setImage(images), (this.props['delay'] || 5) * 1000);


    }
}

export default BackgroundChanger;
