import React from 'react'
import {Button, Item, Icon, Input, Card} from "semantic-ui-react";

class Settings extends React.Component {
    handleScanLibraryClick = (uid) => {
        if(this.props.onStartLibraryScan) {
            this.props.onStartLibraryScan(uid);
        }
    };

    render () {
        return (
            <div className="settings">
                <h2>Libraries</h2>
                <Card.Group>
                    {this.props.libraries.map((lib) =>
                        <Card fluid raised key={"settings-lib-" + lib.uid}>
                            <Card.Content>
                                <Card.Header>{lib.name}</Card.Header>
                                <Card.Meta><Icon name={lib.type === 'movie' ? 'film' : 'tv'}/> {lib.type}</Card.Meta>
                                <Card.Description>
                                    <Input fluid size='massive' icon='folder' value={lib.path} readOnly='true'/>
                                </Card.Description>
                            </Card.Content>
                            <Card.Content extra>
                                <Item.Extra>
                                    <Button onClick={(e) => this.handleScanLibraryClick(lib.uid)} loading={lib.scanning} icon='refresh'>
                                    </Button>
                                    <Button animated='vertical' color='red' floated='right'>
                                        <Button.Content hidden>Delete</Button.Content>
                                        <Button.Content visible>
                                            <Icon name='delete' />
                                        </Button.Content>
                                    </Button>
                                </Item.Extra>
                            </Card.Content>
                        </Card>
                    )}
                    <Card fluid raised>
                        <Card.Content extra>
                            <Item.Extra>
                                <Button animated='vertical' floated='right'>
                                    <Button.Content hidden>Scan All</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='refresh' />
                                    </Button.Content>
                                </Button>
                                <Button animated='vertical' color='green' floated='right'>
                                    <Button.Content hidden>Add</Button.Content>
                                    <Button.Content visible>
                                        <Icon name='add' />
                                    </Button.Content>
                                </Button>
                            </Item.Extra>
                        </Card.Content>
                    </Card>
                </Card.Group>
            </div>
        )
    }
}

export default Settings
