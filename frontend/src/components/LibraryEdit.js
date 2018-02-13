import React from 'react'
import {Modal, Form, Header, Button, Icon, List} from "semantic-ui-react";
import PathSelectorContainer from "../containers/PathSelectorContainer";

class LibraryEdit extends React.Component {
    state = {modalOpen: false, library:{...this.props.library}};

    handleOpen = () => this.setState({modalOpen: true});

    handleClose = () => this.setState({modalOpen: false});

    handleCancel = () => {
        this.setState({library: {...this.props.library}});
        this.handleClose();
    };

    handleChangeName = (name) => {
        this.setState({...this.state, ...{library: {...this.state.library, ...{name: name}}}});
    };

    handleFolderSelected = (path) => {
        this.setState({...this.state, ...{library: {...this.state.library, ...{path: path}}}});
    };

    handleSelectType = (type) => {
        if (this.props.library.uid) return;

        this.setState({...this.state, ...{library: {...this.state.library, ...{type: type}}}});
    };

    handleSave = () => {
        this.props.onUpdateLibrary && this.props.onUpdateLibrary(this.props.library, this.state.library);
        this.handleClose();
    };

    render() {
        let {library} = this.state;

        return (
            <Modal className="library-edit"
                   open={this.state.modalOpen}
                   trigger={
                       <Button icon='edit' color='blue' onClick={this.handleOpen}/>
                   }
            >
                <Modal.Header>Edit Library</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <h4>Library type</h4>
                        <List divided horizontal>
                            <List.Item as='a' disabled={library.type!=='episode'} onClick={() => this.handleSelectType('episode')}>
                                <Icon name='tv' size='huge'/>
                                <List.Content>
                                    <List.Header>TV Shows</List.Header>
                                </List.Content>
                            </List.Item>
                            <List.Item as='a' disabled={library.type!=='movie'} onClick={() => this.handleSelectType('movie')}>
                                <Icon name='film' size='huge'/>
                                <List.Content>
                                    <List.Header>Movies</List.Header>
                                </List.Content>
                            </List.Item>
                        </List>
                        <br />
                        <br />
                        <Form>
                            <Form.Input size='massive' label='Library Name' value={library.name} onChange={(e) => this.handleChangeName(e.target.value)}/>
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
                    <Button primary onClick={this.handleSave} positive>
                        Save
                    </Button>

                </Modal.Actions>
            </Modal>
        )
    }
};


export default LibraryEdit;