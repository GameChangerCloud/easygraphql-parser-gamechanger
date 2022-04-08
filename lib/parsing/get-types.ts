/**
 * From the schema, fetch all the types object and return an array of it
 * @param {*} schemaJSON
 * @returns
 */

export const getAllTypesName = (schemaJSON) => {
    let typesName: string[] = []
    for (const typeName in schemaJSON) {
        if (typeName !== "Query" && typeName !== "Mutation")
            typesName.push(typeName)
    }
    return typesName
}

export const getTypesExceptQueries = (schemaJSON) => {
    let types: any[] = []
    for (const type in schemaJSON) {
        if (type !== "Query" && type !== "Mutation")
            types.push(schemaJSON[type])
        schemaJSON[type]["typeName"] = type
    }
    return types
}

