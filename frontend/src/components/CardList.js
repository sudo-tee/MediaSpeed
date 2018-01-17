import React from 'react';
import CardItem from './CardItem';

const MovieList = [
   {id: 1, title: 'A Magic Christmas', type: "movie", local_screenshot: "Z2lum9p_screenshot.jpg", local_poster: "Z2lum9p_poster.jpg", local_backdrop: "Z2lum9p_backdrop.jpg"},
   {id: 2, title: 'Back to the Future Part II', type: "movie", local_screenshot: "1634HT_screenshot.jpg", local_poster: "1634HT_poster.jpg", local_backdrop: "1634HT_backdrop.jpg"}
]

class CardList extends React.Component {   
   render() {
      return MovieList.map((item) => <div>
         <CardItem media={item} />
      </div>)
   }
}

export default CardList;