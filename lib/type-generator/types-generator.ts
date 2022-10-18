import fs from "fs";
import path from "path";
import {Field} from "../models/field";
import {hasFieldType, isSchemaValid, Type} from "../index";

export const typesGenerator = (schemaJSON) => {
    let types = Type.initTypes(schemaJSON)
    let isValidSchema = isSchemaValid(types)
    if (!isValidSchema.response) {
        if (isValidSchema.reason === "Missing required id field of type ID in one or multiple Entity") {
            let idField: Field = JSON.parse(fs.readFileSync(
                path.join(__dirname, 'id-field.json'),
                'utf8'
            ));

            types
                .filter(type => type.type === "ObjectTypeDefinition" && type.isNotOperation())
                .forEach(type => {
                    console.log(`type ${type.typeName} is missing ID field, one was created automatically`)
                    if (!hasFieldType(type, 'ID').answers) {
                        type.fields.unshift(idField)
                    }
                })
        } else {
            throw new Error(
                'Incorrect schema, please write a valid graphql schema based on the supported guidelines.\nReason: ' +
                isValidSchema.reason
            )
        }
    }

    console.log('Your schema is valid and is containing the following types: ')
    types.forEach(type => console.log(
        `name : ${type.typeName}, `
        + `fields : ${type.fields.map(field => field.name)}\n`
    ))

    return types
}