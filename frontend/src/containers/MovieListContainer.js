import React from 'react';
import MediaList from '../components/MediaList';

export default class MoviesListContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            error: null,
            data: null
        }
    }

    async componentDidMount() {
        try {
            const result = await fetch('/api/movies');
            const movies = await result.json();
            this.setState({loading:false, data: movies});
        } catch (e) {
            this.setState({loading:false, error: e.message});
        }
    }

    render() {
        if(this.state.loading) return <div>Loading..</div>;
        if(this.state.error) return <div>{this.state.error}..</div>;

        return <MediaList medias={this.state.data} />
    }
}
