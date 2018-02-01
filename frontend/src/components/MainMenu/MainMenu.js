import React, {Component} from 'react'
import {Menu, Image, Icon, Sidebar} from 'semantic-ui-react'
import {NavLink} from 'react-router-dom'
import './MainMenu.css'

class MainMenu extends Component {

    getUrl = (library) => {
        let url = '/';
        if(library) {
            if(library.type === 'episode') {
                url = `/library/${library.uid}/shows`;
            } else {
                url = `/library/${library.uid}/${library.type}s`;
            }
        }

        return url
    };

    render() {
        const libraries = this.props.libraries || [];
        return (
            <Sidebar  as={Menu} visible={this.props.visible} vertical>
                <div className="sidebar-content">
                    <Menu.Item className="header-logo"><Image src="/logo.png" size="mini"></Image>Media Speed</Menu.Item>
                    <Menu.Item as={NavLink} exact to="/"><Icon name='home' />Home</Menu.Item>
                    {libraries.map((lib) => <Menu.Item
                            as={NavLink}
                            to={this.getUrl(lib)}
                            key={lib.uid} >
                            <Icon name={lib.type === 'movie' ? 'film' : 'tv'}/>{lib.name}
                        </Menu.Item>
                    )}
                    <Menu.Header>Manage</Menu.Header>
                    <Menu.Item as={NavLink} to="/settings"><Icon name='setting'/>Settings</Menu.Item>

                </div>
            </Sidebar>
        )
    }
}

//Propstype
export default MainMenu