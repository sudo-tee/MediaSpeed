import React, {PureComponent} from 'react';
import {Card, Image} from 'semantic-ui-react';
import {NavLink} from "react-router-dom";

class SeasonItem extends PureComponent {
    constructor() {
        super(...arguments);

        let defaultImage = '/web/img/default-backdrop.jpg';
        let fromMedia = this.props.media.local_poster || this.props.media.local_screenshot;
        this.img = fromMedia ? '/images/' + fromMedia : defaultImage;

    }

    getUrl(mediaItem) {
        return `/libraries/${mediaItem.library_uid}/${mediaItem.type}s/${mediaItem.uid}`;
    }

    render() {
        return <Card className="media-item" as={NavLink} to={this.getUrl(this.props.media)}>
            <div className="media-item-image-container">
                <Image src={this.img}/>
                <div className="media-item-hover">
                </div>
            </div>
            <Card.Content>
                <Card.Header>Season {this.props.media.season_number}</Card.Header>
                <Card.Meta>
                    <span>{this.props.media.name}</span>
                </Card.Meta>
            </Card.Content>

        </Card>
    }
}

export default SeasonItem;