import {Field} from './field'

import {getSQLTableName} from "../utils/get-sql-table-name";
import * as Util from "util";

export interface IType {
    type: string;
    typeName: string;
    sqlTypeName: string;
    description: string;
    directives: any[];
    relationList: any[];
    fields: Field[];
    implementedTypes: any;
}

export class Type {
    type: string;
    typeName: string;
    sqlTypeName: string;
    description: string;
    directives: any[];
    relationList: any[];
    fields: Field[];
    implementedTypes: any;

    constructor(type: string, typeName: string, sqlTypeName: string, description: string, directives: any[], implementedTypes: any,) {
        this.type = type
        this.typeName = typeName
        this.sqlTypeName = sqlTypeName
        this.description = description
        this.directives = directives
        this.fields = []
        this.implementedTypes = implementedTypes
        // stores all the relations which were found for a give type
        this.relationList = []
    }

    static initTypes(schemaJSON: any): Type[] {
        let types: Type[] = []
        for (const typeName in schemaJSON) {
            let typeToAdd = new Type(
                schemaJSON[typeName].type,
                typeName,
                getSQLTableName(typeName),
                schemaJSON[typeName].description ? schemaJSON[typeName].description : "",
                schemaJSON[typeName].directives ? schemaJSON[typeName].directives : [],
                schemaJSON[typeName].implementedTypes ? schemaJSON[typeName].implementedTypes : []
            )
            for (const field of schemaJSON[typeName].fields as Field[]) {
                let fieldToAdd = new Field(
                    field.name,
                    field.type,
                    field.noNullArrayValues,
                    field.noNull,
                    field.isArray,
                    field.directives,
                    field.arguments,
                    field.isDeprecated,
                )
                if (field["name"] === 'id') {
                    fieldToAdd.setNoNull()
                }
                //Init missingInfos on the field
                fieldToAdd.initObjectParameters()
                //adds the field to the type
                typeToAdd.addField(fieldToAdd)
            }
            types.push(typeToAdd)
        }
        return types;
    }

    addField(field) {
        this.fields.push(field)
    }
}
