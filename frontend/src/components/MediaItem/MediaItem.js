import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import './MediaItem.css';

class MediaItem extends React.Component {
   constructor() {
      super(...arguments);

      if(this.props.layout === "backdrop") {
          this.img = '/images/' + this.props.media.local_backdrop;
      } else {
          this.img = '/images/' + this.props.media.local_poster;
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