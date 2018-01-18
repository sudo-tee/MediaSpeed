import React from 'react';
import MainMenu from '../components/MainMenu/MainMenu';

export default class LibraryMenuContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            loading: true,
            error: null,
            data: []
        }
    }

    async componentDidMount() {
        try {
            const result = await fetch('/api/libraries');
            const libraries = await result.json();
            this.setState({loading:false, data: libraries});
        } catch (e) {
            this.setState({loading:false, error: e.message});
        }
    }

    render() {
        if(this.state.error) return <div>{this.state.error}..</div>;
        if(this.state.loading) return <MainMenu />;
        return <MainMenu libraries={this.state.data} />
    }
}
