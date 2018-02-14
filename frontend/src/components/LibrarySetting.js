import React from 'react'
import {Button, Item, Icon, Card, Progress} from "semantic-ui-react";
import LibraryEdit from "./LibraryEdit";

const LibrarySetting = ({library, onStartLibraryScan, onUpdateLibrary, onDeleteLibrary}) =>
    <Card raised>
        <Card.Content>
            <Card.Header>{library.name}</Card.Header>
            <Card.Meta style={{margin:'auto'}}><Icon name={library.type === 'movie' ? 'film' : 'tv'} size='massive'/></Card.Meta>
        </Card.Content>
        <Card.Content extra>
            <Item.Extra>
                <Button onClick={(e) => onStartLibraryScan(library.uid)} loading={library.scanning} icon='refresh'/>
                <LibraryEdit library={library} onUpdateLibrary={onUpdateLibrary} triggerProperties={{icon: 'edit', color:'blue'}}/>
                <Button negative floated='right' icon='delete' onClick={(e) => onDeleteLibrary(library)}/>
            </Item.Extra>
        </Card.Content>
        {library.scanning && <Progress percent={library.scanning_progress} attached='bottom' active/>}
    </Card>;

export default LibrarySetting
