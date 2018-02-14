import React from 'react'
import {Button, Item, Icon, Card} from "semantic-ui-react";
import LibrarySettingContainer from "../containers/LibrarySettingContainer";
import LibraryEdit from "./LibraryEdit";

const Settings = ({libraries, onCreateLibrary}) => <div className="settings">
    <h2>Libraries</h2>
    <Card.Group>
        {libraries.map((lib) =>
            <LibrarySettingContainer key={`library-setting-${lib.uid}`} library={lib} />
        )}
        <Card fluid raised>
            <Card.Content extra>
                <Item.Extra>
                    <Button floated='right' icon='refresh'>
                    </Button>
                    <LibraryEdit create onUpdateLibrary={onCreateLibrary} triggerProperties={{icon: 'add', positive:true, floated:'right'}}/>
                </Item.Extra>
            </Card.Content>
        </Card>
    </Card.Group>
</div>;

export default Settings
