import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import './MediaItem.css';

class MediaItem extends React.Component {
   constructor() {
      super(...arguments);
      this.img = '/images/' + this.props.media.local_poster;
   }

   render() {
      return <Card>
         <Image src={this.img} />
         <Card.Content>
            <Card.Header>{this.props.media.title  || this.props.media.name}</Card.Header>
            <Card.Meta>
              <span className='date'>
                ({this.props.media.year  || new Date(this.props.media.first_air_date).getYear()})
              </span>
            </Card.Meta>
         </Card.Content>
      </Card>
   }
}

export default MediaItem;