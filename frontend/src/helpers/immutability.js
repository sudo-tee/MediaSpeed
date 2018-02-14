export function update(state, entity, collectionKey = 'items', entityIdKey='uid') {
    const updatedEntity = {...state[collectionKey][entity[entityIdKey]], ...entity};
    return {
        ...state,
        ...{
            [collectionKey]:
                {
                    ...state[collectionKey],
                    ...{[entity[entityIdKey]]: updatedEntity}
                }
        }
    };

}

export function remove(state, entityUid, collectionKey = 'items') {
    const entities = {...state[collectionKey]};
    delete entities[entityUid];

    return {
        ...state,
        ...{[collectionKey]:entities}
    }
}