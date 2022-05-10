/**
 * From the schema, fetch all the types object and return an array of it
 * @param {*} schemaJSON
 * @returns
 */

export const getAllTypesName = (schemaJSON): string[] => {
    let typesName: string[] = []
    for (const typeName in schemaJSON) {
        if (typeName !== "Query" && typeName !== "Mutation")
            typesName.push(typeName)
    }
    return typesName
}

export const getTypesExceptQueries = (schemaJSON) => {
    let types: any[] = []
    for (const typeName in schemaJSON) {
        if (typeName !== "Query" && typeName !== "Mutation")
            types.push(schemaJSON[typeName])
        schemaJSON[typeName]["typeName"] = typeName
    }
    return types
}

