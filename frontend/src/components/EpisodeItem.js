import React, {PureComponent} from 'react';
import {Card, Icon, Image} from 'semantic-ui-react';
import {withRouter} from "react-router-dom";

class EpisodeItem extends PureComponent {
    constructor() {
        super(...arguments);

        let defaultImage = '/web/img/default-backdrop.jpg';
        let fromMedia = this.props.media.local_backdrop || this.props.media.local_still || this.props.media.local_screenshot;
        this.img = fromMedia ? '/images/' + fromMedia : defaultImage;

    }

    play = (e) => {
        e.stopPropagation();
        this.props.onPlay(this.props.media);
    };

    render() {
        return <Card className="media-item" onClick={this.play}>
            <div className="media-item-image-container">
                <Image src={this.img}/>
                <div className="media-item-hover">
                    <div className="media-item-play-icon" onClick={this.play}><Icon name="play"/></div>
                </div>
            </div>
            <Card.Content>
                <Card.Header>{this.props.media.name}</Card.Header>
                <Card.Meta>
                    <span>Episode {this.props.media.episode_number}</span>
                </Card.Meta>
            </Card.Content>

        </Card>
    }
}

export default withRouter(EpisodeItem);