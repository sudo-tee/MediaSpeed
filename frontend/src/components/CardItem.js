import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import './CardItem.css';

class CardItem extends React.Component {
   constructor() {
      super(...arguments);
      this.img = 'http://belanger.ddns.net:5001/images/' + this.props.media.local_poster;
   }

   render() {
      return <Card>
         <Image src={this.img} />
         <Card.Content>
            <Card.Header>{this.props.media.title}</Card.Header>            
         </Card.Content>
      </Card>
   }
}

export default CardItem;