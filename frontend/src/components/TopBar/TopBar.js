import React, {Component} from 'react'
import {Menu, Icon} from 'semantic-ui-react'

class TopBar extends Component {
    handleItemClick = (e) => {
        if(this.props.onToggleMenu) {
            this.props.onToggleMenu(e);
        }
    };

    render() {
        let classNames = "topbar";
        if(this.props.mainMenuVisible) classNames += " main-menu-visible";
        return (
            <Menu attached='top' className={classNames}>
                <Menu.Item className="menu-toggle" onClick={this.handleItemClick}><Icon name='content' size='large'/></Menu.Item>
                <Menu.Item className="menu-title">{this.props.title || ''}</Menu.Item>
                <Menu.Item className="right"><Icon name='filter' size='large'/></Menu.Item>
            </Menu>
        )
    }
}

export default TopBar
