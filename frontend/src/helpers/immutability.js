export function update(state, entity, collectionKey = 'items', entityIdKey='uid') {
    const updatedEntityy = {...state[collectionKey][entity[entityIdKey]], ...entity};
    return {
        ...state,
        ...{
            [collectionKey]:
                {
                    ...state[collectionKey],
                    ...{[entity[entityIdKey]]: updatedEntityy}
                }
        }
    };

}