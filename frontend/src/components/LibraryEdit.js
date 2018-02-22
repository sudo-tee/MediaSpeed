import React from 'react'
import {Modal, Form, Button, Icon, List} from "semantic-ui-react";
import PathSelectorContainer from "../containers/PathSelectorContainer";

class LibraryEdit extends React.Component {
    defaultLibrary = {name: '', path: '/', type: ''};
    library = this.props.library || this.defaultLibrary;
    state = {modalOpen: false, library: {...this.library}};

    handleOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    handleCancel = () => {
        this.setState({library: {...this.defaultLibrary}});
        this.handleClose();
    };

    handleChangeName = (name) => {
        this.setState({...this.state, ...{library: {...this.state.library, ...{name: name}}}});
    };

    handleFolderSelected = (path) => {
        this.setState({...this.state, ...{library: {...this.state.library, ...{path: path}}}});
    };

    handleSelectType = (type) => {
        if (this.state.library.uid) return;

        this.setState({...this.state, ...{library: {...this.state.library, ...{type: type}}}});
    };

    handleSave = () => {
        this.props.onUpdateLibrary && this.props.onUpdateLibrary(this.props.library, this.state.library);
        this.handleClose();
    };

    canSave() {

        return this.state.library.name.length > 2
            && this.state.library.path.length >= 1
            && (this.state.library.type === 'movie' || this.state.library.type === 'episode')

    }

    render() {
        let {library} = this.state;
        return (
            <Modal className="library-edit"
                   open={this.state.modalOpen}
                   trigger={
                       <Button {...this.props.triggerProperties} onClick={this.handleOpen}/>
                   }
            >
                <Modal.Header>Edit Library</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <h4>Library type</h4>
                        <List divided horizontal>
                            <List.Item as='a' disabled={(library.type !== 'episode' && library.type !== '')}
                                       onClick={() => this.handleSelectType('episode')}>
                                <Icon name='tv' size='huge'/>
                                <List.Content>
                                    <List.Header>TV Shows</List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item as='a' disabled={library.type !== 'movie' && library.type !== ''}
                                       onClick={() => this.handleSelectType('movie')}>
                                <Icon name='film' size='huge'/>
                                <List.Content>
                                    <List.Header>Movies</List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                        <br/>
                        <br/>
                        <Form>
                            <Form.Input size='massive' label='Library Name' value={library.name}
                                        onChange={(e) => this.handleChangeName(e.target.value)}/>
                            <Form.Field>
                                <label>Path</label>
                                <PathSelectorContainer path={library.path}
                                                       onFolderSelected={this.handleFolderSelected}/>
                            </Form.Field>
                        </Form>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button negative onClick={this.handleCancel}>
                        Cancel
                    </Button>
                    <Button primary onClick={this.handleSave} disabled={!this.canSave()} positive>
                        Save
                    </Button>

                </Modal.Actions>
            </Modal>
        )
    }
};


export default LibraryEdit;