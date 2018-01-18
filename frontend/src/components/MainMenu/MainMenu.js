import React, {Component} from 'react'
import {Menu, Image} from 'semantic-ui-react'
import {withRouter} from 'react-router-dom'


class MainMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeItem: 'home',
        };
    }

    handleItemClick = (e, {library}) => {
        let url = '/';
        if(library) {
            this.setState({activeItem: library.uid});

            if(library.type === 'episode') {
                url = `/library/${library.uid}/shows`;
            } else {
                url = `/library/${library.uid}/${library.type}s`;
            }

        }
        this.props.history.push(url)
    };

    render() {
        const {activeItem} = this.state;
        const libraries = this.props.libraries || [];

        return (
            <Menu stackable>
                <Menu.Item as='a' header key='home' library='' onClick={this.handleItemClick}>
                    <Image
                        size='mini'
                        src='/logo.png'
                    />
                    Media Speed
                </Menu.Item>

                {libraries.map((lib) => {
                    return <Menu.Item
                        library={lib}
                        key={lib.uid}
                        name={lib.name}
                        active={activeItem === lib.uid}
                        onClick={this.handleItemClick}>
                        {lib.name}
                    </Menu.Item>
                })}

            </Menu>
        )
    }
}

export default withRouter(MainMenu)