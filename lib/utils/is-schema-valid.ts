import {IType} from "../models/type";
import {isBasicType} from "../scalar-managment/manage-scalars";

export const isSchemaValid = (types: IType[]) => {
    let typesNames = types.map(type => type.typeName)
    let response = {response: true, reason: ""}
    if (!typesHaveId(typesNames, types)) {
        response = {
            response: false,
            reason: "Missing required id field of type ID in one or multiple Entity"}
    }
    if (!fieldTypeExists(typesNames, types)) {
        response = {
            response: false,
            reason: "One Entity has one or multiple fields of undefined types. Please use default scalar, declare your own scalar or declare missing entity type"
        }
    }
    return response
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
const fieldTypeExists = (typesNames: string[], types: IType[]) => {
    for (let type of types) {
        for (let field of type.fields) {
            if(!isBasicType(field.type) && !typesNames.includes(field.type)){
                return false
            }
        }
    }
    return true
}