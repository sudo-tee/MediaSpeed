import React from 'react';
import CardItem from './CardItem';
import {Grid} from 'semantic-ui-react';



class CardList extends React.Component {
    constructor(props){
        super(props);
        this.state = {movies: []};
    }

   async componentDidMount() {
       const res = await fetch('/api/movies');
       const movies = await res.json();
       this.setState({movies: movies})

   }

   render() {
      return <Grid doubling columns={5}>
          {this.state.movies.map((item) => {
             return <Grid.Column>
               <CardItem key={item.id} media={item} />
             </Grid.Column>
          })}
      </Grid>
   }
}

export default CardList;