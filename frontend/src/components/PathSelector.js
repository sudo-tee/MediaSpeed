import React from 'react'
import {Modal, Input, Header, List, Button} from "semantic-ui-react";
import {join} from 'path'

class PathSelector extends React.Component {
    state = {modalOpen: false};

    handleOpen = () => this.setState({modalOpen: true});
    handleClose = () => this.setState({modalOpen: false});
    handleFolderSelected = () => {
        this.props.onFolderSelected && this.props.onFolderSelected(this.props.currentPath);
        this.handleClose()
    };

    render() {
        let {defaultPath, currentPath, subPaths, onNavigateToPath, onOpen} = this.props;
        subPaths = subPaths || [];

        const displayedPath = currentPath || defaultPath;
        const parentPath = join(displayedPath, '..');
        const displayNavigateToParent = displayedPath !== parentPath;
        return (
            <Modal className="path-selector"
                   onOpen={onOpen}
                   open={this.state.modalOpen}
                   trigger={
                       <Input fluid size='massive'
                              icon='folder'
                              value={defaultPath}
                              readOnly='true'
                              onClick={this.handleOpen}
                              className='path-selector-trigger'
                       />
                   }
            >
                <Modal.Header>Select a Path</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <Header>Current path</Header>
                        <Input fluid size='massive' icon='folder' value={displayedPath} autoComplete="off"
                               readOnly='true'/>
                        <List divided size='large' className="path-list">
                            {displayNavigateToParent &&
                            <List.Item as='a' onClick={() => onNavigateToPath(parentPath)}>
                                <List.Icon name='level up'/>
                                <List.Content>
                                    .. [Back]
                                </List.Content>
                            </List.Item>}
                            {subPaths.map((folder) =>
                                <List.Item key={folder} as='a' onClick={() => onNavigateToPath(join(displayedPath, folder))}>
                                    <List.Icon name='folder'/>
                                    <List.Content>
                                        {folder}
                                    </List.Content>
                                </List.Item>
                            )}
                        </List>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.handleClose}>
                        Cancel
                    </Button>
                    <Button primary onClick={this.handleFolderSelected} positive>
                        Select
                    </Button>

                </Modal.Actions>
            </Modal>
        )
    }
};


export default PathSelector;