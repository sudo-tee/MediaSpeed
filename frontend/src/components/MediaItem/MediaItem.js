import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import './MediaItem.css';

class MediaItem extends React.Component {
   constructor() {
      super(...arguments);

      if(this.props.layout === "backdrop") {
         let defaultImage = '/web/img/default-backdrop.jpg';
         let fromMedia = this.props.media.local_backdrop || this.props.media.local_still || this.props.media.local_screenshot;
         this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
      } else {

         let defaultImage = '/web/img/default-poster.jpg';
         let fromMedia = this.props.media.local_poster || this.props.media.local_screenshot;
         this.img = fromMedia ? '/images/' + fromMedia : defaultImage;
      }

      this.year = this.props.media.year  || new Date(this.props.media.first_air_date).getFullYear();
   }

   render() {
      return <Card className="media-item">
         <Image src={this.img} />
         <Card.Content>
            <Card.Header>{this.props.media.title  || this.props.media.name}</Card.Header>
            <Card.Meta>
              <span className='date'>({this.year || "No year"})</span>
            </Card.Meta>
         </Card.Content>
      </Card>
   }
}

export default MediaItem;