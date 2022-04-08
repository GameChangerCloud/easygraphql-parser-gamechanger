import {IType} from "../models/type";

export const isSchemaValid = (types: IType[]) => {
    let typesNames = types.map(type => type.typeName)

    if (!typesHaveId(typesNames, types))
        return {response: false, reason: "Missing required id field of type ID in one or multiple Entity"}

    if (!fieldTypeExists(typesNames, types))
        return {response: false, reason: "One Entity has one or multiple fields of undefined types. Please use default scalar, declare your own scalar or declare missing entity type"}

    return {response: true}
}

const typesHaveId = (typesNames, types) => {
    for (let index = 0; index < types.length; index++) {
        if (typesNames[index] !== "Query" && typesNames[index] !== "Mutation" && types[index].type !== "ScalarTypeDefinition" && types[index].type !== "EnumTypeDefinition") {
            if (!types[index].fields.find(field => field.name === "id")) {
                return false
            }
        }
    }
    return true
}

// Check if the types of field are correct (default scalar, personalized scalar of other existing entities)
const fieldTypeExists = (typesNames, types) => {
    for (let i = 0; i < types.length; i++) {
        let fields = types[i].fields
        for (let j = 0; j < fields.length; j++) {
            if (fields[j].type !== "ID" && fields[j].type !== "String" && fields[j].type !== "Int" && fields[j].type !== "Boolean" && fields[j].type !== "Float") { // Default scalar
                if (!typesNames.includes(fields[j].type)) { // User scalars or Entities
                    return false
                }
            }

        }
    }
    return true
}