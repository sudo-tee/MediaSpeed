import React, {PureComponent} from 'react';
import {Image} from 'semantic-ui-react';

class MediaPoster extends PureComponent {
    constructor() {
        super(...arguments);

        if (this.props.layout === "backdrop") {
            let defaultImage = '/web/img/default-backdrop.jpg';
            let fromMedia = this.props.media.local_backdrop || this.props.media.local_still || this.props.media.local_screenshot;
            this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
        } else {

            let defaultImage = '/web/img/default-poster.jpg';
            let fromMedia = this.props.media.local_poster || this.props.media.local_screenshot;
            this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
        }

        this.year = this.props.media.year || new Date(this.props.media.first_air_date).getFullYear();
    }


    render() {
        return <div className="media-poster-container">
            <Image src={this.img}/>
        </div>
    }
}

export default MediaPoster;