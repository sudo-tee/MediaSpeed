import React from 'react';
import {Card, Image} from 'semantic-ui-react';
import './CardItem.css';

class CardItem extends React.Component {
   constructor() {
      super(...arguments);
      this.img = '/images/' + this.props.media.local_poster;
   }

   render() {
      return <Card raised>
         <Image src={this.img} />
         <Card.Content extra>
            {this.props.media.title}
         </Card.Content>
      </Card>
   }
}

export default CardItem;