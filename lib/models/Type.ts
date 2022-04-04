import {Field} from './Field'

const {getSQLTableName} = require('../utils/getSQLTableName')

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

    static initTypes(schemaJSON: any) {
        let types: Type[] = []
        for (const type in schemaJSON) {
            let typeToAdd = new Type(
                schemaJSON[type]['type'],
                type,
                getSQLTableName(type),
                schemaJSON[type]['description'],
                schemaJSON[type]['directives'],
                schemaJSON[type]['implementedTypes']
            )
            for (const field in schemaJSON[type]['fields']) {
                let selectedField = schemaJSON[type]['fields'][field]
                let fieldToAdd = new Field(
                    selectedField['name'],
                    selectedField['type'],
                    selectedField['noNullArrayValues'],
                    selectedField['noNull'],
                    selectedField['isArray'],
                    selectedField['directives'],
                    selectedField['arguments'],
                    selectedField['isDeprecated']
                )
                if (selectedField['name'] === 'id') {
                    fieldToAdd.setNoNull()
                }
                //Init missingInfos on the field
                fieldToAdd.initObjectParameters()
                //adds the field to the type
                typeToAdd.addField(fieldToAdd)
            }
            types.push(typeToAdd)
        }
        return types
    }

    addField(field) {
        this.fields.push(field)
    }
}
