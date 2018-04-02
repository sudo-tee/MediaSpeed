import React, {PureComponent} from 'react';
import {Card, Icon, Image} from 'semantic-ui-react';
import withRouter from "react-router-dom/es/withRouter";


class MediaItem extends PureComponent {
    constructor() {
        super(...arguments);

        if (this.props.layout === "backdrop") {
            let defaultImage = '/web/img/default-backdrop.jpg';
            let fromMedia = this.props.media.local_backdrop || this.props.media.local_still || this.props.media.local_screenshot;
            this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
        } else {
            let defaultImage = '/web/img/default-poster.png';
            let fromMedia = this.props.media.local_poster || this.props.media.local_screenshot;
            this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
        }

        const date = this.props.media.release_date || this.props.media.air_date || this.props.media.first_air_date;
        this.year = new Date(date).getFullYear();
    };

    navigateToInfoPage = () => {
        this.props.history.push(`/libraries/${this.props.media.library_uid}/${this.props.media.type}s/${this.props.media.uid}`);
    };

    play = (e) => {
        e.stopPropagation();
        this.props.history.push(`/play/${this.props.media.type}s/${this.props.media.uid}`);
    };

    render() {
        return <Card style={{width: 200}} className="media-item" onClick={this.navigateToInfoPage}>
            <div style={{width: 200}} className="media-item-image-container">
                <Image style={{width: 200}} src={this.img}/>
                <div className="media-item-hover">
                    {this.props.playable &&
                    <div className="media-item-play-icon" onClick={this.play}><Icon name="play"/></div>}
                </div>
            </div>
            <Card.Content>
                <Card.Header>{this.props.media.title || this.props.media.name}</Card.Header>
                <Card.Meta>
                    <span className='date'>({this.year || "No year"})</span>
                </Card.Meta>
            </Card.Content>
        </Card>
    }
}

export default withRouter(MediaItem);