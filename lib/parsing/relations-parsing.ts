/** Fonctions principales */
import {Relationships} from "../constants/relationships";
import {getSQLTableName} from "../utils/get-sql-table-name";
import {IType} from "../models/type";

const manageScalars = require('../scalar-managment/manage-scalars')

/**
 *  Compute relationships oneToMany, manyToMany, etc..
 * @param {*} types contains all types with associated attributes read from easygraphql-parser
 * @param {*} typenames names assocoated with each type
 * @param {*} env allows to throw errors of not supported relations without stacktrace
 * @returns
 */
export const getRelations = (types, env) => {
    let typeNames = types.map(type => type.typeName)
    let manyToMany: any = []

    types.forEach(currentType => {
        if (currentType.type === "ObjectTypeDefinition" && currentType.isNotOperation()) {
            let relationalFields = getRelationalFields(currentType.fields)
            relationalFields.forEach(relationalField => { // Check if it's not a scalar currentType
                // we skip fields that were being added by other types ( ex: ManyOnly relation)
                if (!relationalField["delegated_field"]["state"]) {
                    let out = getRelationOf(relationalField.type, types, typeNames, currentType.typeName)
                    let inn = getRelationOf(currentType.typeName, types, typeNames, relationalField.type)
                    if (out == 2 && inn == 2) { // Checking if self join (currentType related to itself)
                        if (relationalField.type === currentType.typeName) {
                            currentType["relationList"].push(
                                {
                                    "type": relationalField.type,
                                    "relation": Relationships.selfJoinMany
                                })
                            relationalField["relation"] = true
                            relationalField["relationType"] = Relationships.selfJoinMany
                            relationalField["activeSide"] = true

                            // add info of joinTable Associated
                            relationalField["joinTable"]["state"] = true
                            relationalField["joinTable"]["name"] = currentType.typeName + "_" + relationalField.type + "_" + relationalField.name
                            relationalField["joinTable"]["contains"].push(
                                {
                                    "fieldName": relationalField.name.toLowerCase(),
                                    "type": relationalField.type,
                                    "constraint": "FOREIGN KEY (\"" + relationalField.name.toLowerCase() + "_id\") REFERENCES " + getSQLTableName(relationalField.type) + " (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"
                                })
                            // add info about selfType
                            relationalField["joinTable"]["contains"].push({
                                "fieldName": relationalField.type.toLowerCase(),
                                "type": relationalField.type,
                                "constraint": "FOREIGN KEY (\"" + relationalField.type.toLowerCase() + "_id\") REFERENCES " + getSQLTableName(relationalField.type) + " (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"


                            })
                            // the field won't appear in model
                            relationalField["in_model"] = false

                            // No addition needed for ManyToMany --> only through join table
                        } else {
                            if (relationalField.directives.length > 0 && relationalField.directives.filter(directive => directive.name == 'hasInverse').length > 0) {
                                currentType["relationList"].push({
                                    "type": relationalField.type,
                                    "relation": Relationships.manyToMany
                                })

                                relationalField["relation"] = true
                                relationalField["relationType"] = Relationships.manyToMany

                                relationalField["activeSide"] = true
                                // add info of jointable Associated
                                relationalField["joinTable"]["state"] = true
                                relationalField["joinTable"]["name"] = currentType.typeName + "_" + relationalField.type + "_" + relationalField.name
                                relationalField["joinTable"]["contains"].push({
                                    "fieldName": relationalField.name.toLowerCase(),
                                    "type": relationalField.type,
                                    "constraint": "FOREIGN KEY (\"" + relationalField.name + "_id\") REFERENCES \"" + getSQLTableName(relationalField.type) + "\" (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"

                                })

                                // gets the related field of join table in the other side thanks to hasInverseDirective info
                                let hasInverseFieldName = relationalField.directives.filter(directive => directive.name == 'hasInverse')[0].args[0].value
                                // push it into joinTable info
                                relationalField["joinTable"]["contains"].push({
                                    "fieldName": currentType.typeName.toLowerCase(),
                                    "type": currentType.typeName,
                                    "constraint": "FOREIGN KEY (\"" + currentType.typeName.toLowerCase() + "_id\") REFERENCES \"" + getSQLTableName(currentType.typeName) + "\" (\"Pk_" + getSQLTableName(currentType.typeName) + "_id\")"
                                })

                                manyToMany.push({"type": currentType, "relationship": relationalField})
                                // the field wont appear in model
                                relationalField["in_model"] = false
                                // No addition needed for ManyToMany --> only through join table

                            } else {
                                // standard manyToMany tables but we try to not duplicate tables from each side of relation
                                currentType["relationList"].push({
                                    "type": relationalField.type,
                                    "relation": Relationships.manyToMany
                                })

                                relationalField["relation"] = true
                                relationalField["relationType"] = Relationships.manyToMany
                                // add info of jointable Associated
                                relationalField["joinTable"]["state"] = true
                                relationalField["joinTable"]["name"] = currentType.typeName + "_" + relationalField.type + "_" + relationalField.name
                                relationalField["joinTable"]["contains"].push({
                                    "fieldName": relationalField.name.toLowerCase(),
                                    "type": relationalField.type,
                                    "constraint": "FOREIGN KEY (\"" + relationalField.name + "_id\") REFERENCES \"" + getSQLTableName(relationalField.type) + "\" (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"


                                })
                                // push into jointable info about related currentType . field name is by default currentType name
                                // push it into joinTable info
                                relationalField["joinTable"]["contains"].push({
                                    "fieldName": currentType.typeName.toLowerCase(),
                                    "type": currentType.typeName,
                                    "constraint": "FOREIGN KEY (\"" + currentType.typeName.toLowerCase() + "_id\") REFERENCES \"" + getSQLTableName(currentType.typeName) + "\" (\"Pk_" + getSQLTableName(currentType.typeName) + "_id\")"

                                })

                                manyToMany.push({"type": currentType, "relationship": relationalField})
                                // the field wont appear in model
                                relationalField["in_model"] = false

                                // todo : to be clarified
                            }

                        }
                    } else if (out == 2 && inn == 1) {
                        currentType["relationList"].push({
                            "type": relationalField.type,
                            "relation": Relationships.oneToMany
                        })


                        relationalField["relationType"] = Relationships.oneToMany
                        // A Fk field has to be added to the targeted object
                        let targetType = types.filter(type => type.typeName == relationalField.type)
                        if (targetType.length != 1) {
                            console.error('Reference to currentType ' + relationalField.type + ' found 0 or several times')
                        } else {
                            // set relation status to each side of relation
                            relationalField["relation"] = true

                            // tracks the fk that were added to the targetType
                            relationalField["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName
                            relationalField["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id"
                            relationalField["delegated_field"]["side"] = "origin"


                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(relationalField))
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": relationalField.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id\") REFERENCES \"" + currentType.sqlTypeName + "\" (\"Pk_" + currentType.sqlTypeName + "_id\")"


                            }
                            delegatedField["delegated_field"]["state"] = true
                            delegatedField["name"] = "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id",
                                delegatedField["type"] = "Int"

                            // tracks the currentType who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = currentType.typeName
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = relationalField.name
                            delegatedField["delegated_field"]["side"] = "target"


                            // the field wont appear in model
                            relationalField["in_model"] = false

                            targetType[0].fields.push(delegatedField)

                        }


                    } else if (out == 1 && inn == 2) {
                        currentType["relationList"].push({
                            "type": relationalField.type,
                            "relation": Relationships.manyToOne
                        })


                        relationalField["relationType"] = Relationships.manyToOne
                        // a Fk field has to be added to the current object

                        let targetType = types.filter(type => type.typeName == relationalField.type)
                        relationalField["relation"] = true

                        // tracks the fk that were added to the targetType
                        relationalField["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName
                        relationalField["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id"
                        relationalField["delegated_field"]["side"] = "origin"


                        // if field is null, theres a composition relation, we create a joinTable
                        if (relationalField.noNull) {

                            relationalField["joinTable"]["state"] = true
                            relationalField["joinTable"]["name"] = currentType.typeName + "_" + relationalField.type + "_" + relationalField.name
                            relationalField["joinTable"]["contains"].push({
                                "fieldName": relationalField.name,
                                "type": relationalField.type,
                                "constraint": "FOREIGN KEY (\"" + relationalField.name + "_id\") REFERENCES \"" + getSQLTableName(relationalField.type) + "\" (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"

                            })
                            relationalField["joinTable"]["contains"].push({
                                "fieldName": currentType.typeName.toLowerCase(),
                                "type": currentType.typeName,
                                "constraint": "FOREIGN KEY (\"" + currentType.typeName.toLowerCase() + "_id\") REFERENCES \"" + getSQLTableName(currentType.typeName) + "\" (\"Pk_" + getSQLTableName(currentType.typeName) + "_id\")"
                            })

                        }
                        // if field can be null, then we do classic processing
                        else {
                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(relationalField))
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + relationalField.name + "_" + getSQLTableName(relationalField.type) + "_id",
                                "type": "int",
                                "noNull": relationalField.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + getSQLTableName(relationalField.type) + "_id\") REFERENCES \"" + currentType.sqlTypeName + "\" (\"Pk_" + currentType.sqlTypeName + "_id\")"

                            }
                            delegatedField["delegated_field"]["state"] = true
                            delegatedField["name"] = "Fk_" + relationalField.name + "_" + getSQLTableName(relationalField.type) + "_id",
                                delegatedField["type"] = "Int"

                            // tracks the currentType who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = currentType.typeName
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = relationalField.name
                            delegatedField["delegated_field"]["side"] = "target"


                            targetType[0].fields.push(delegatedField)
                        }
                        // the field wont appear in model
                        relationalField["in_model"] = false


                    } else if (out == 1 && inn == 1) {
                        // Checking if self join (currentType related to itself)
                        if (relationalField.type === currentType.typeName) {
                            currentType["relationList"].push({
                                "type": relationalField.type,
                                "relation": Relationships.selfJoinOne
                            })

                            relationalField["relation"] = true
                            relationalField["relationType"] = Relationships.selfJoinOne
                            relationalField["foreign_key"] = {
                                "name": "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": relationalField.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id\") REFERENCES \"" + currentType.sqlTypeName + "\" (\"Pk_" + currentType.sqlTypeName + "_id\")"

                            }

                        } else {
                            // insert info about oneToOne relation to the target


                            let targetType = types.filter(type => type.typeName == relationalField.type)
                            let targetField = targetType[0].fields.filter(field => field.type === currentType.typeName)

                            // Detects if a 1-1 relation is present. Not supported on sql
                            if (targetField[0].noNull && relationalField.noNull) {
                                env.error("1-1 Relation not allowed, chekout \n" + relationalField.name + " field on " + targetField[0].type + "\nor \n" + targetField[0].name + " field on " + relationalField.type);
                            }

                            relationalField["oneToOneInfo"] = {
                                "fkName": "Fk_" + targetField[0].name + "_" + getSQLTableName(targetField[0].type) + "_id"
                            }


                            currentType["relationList"].push({
                                "type": relationalField.type,
                                "relation": Relationships.oneToOne
                            })
                            relationalField["relation"] = true
                            relationalField["relationType"] = Relationships.oneToOne
                            // Both object has to integrate a Fk to Pk but each side is processed in each currentType
                            relationalField["foreign_key"] = {
                                "name": "Fk_" + relationalField.name + "_" + getSQLTableName(relationalField.type) + "_id",
                                "type": "int",
                                "noNull": relationalField.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + getSQLTableName(relationalField.type) + "_id\") REFERENCES \"" + getSQLTableName(relationalField.type) + "\" (\"Pk_" + getSQLTableName(relationalField.type) + "_id\")"
                            }


                        }
                    }
                    // One only
                    else if ((out == 0 && inn == 1) || (out == 1 && inn == 0)) {
                        currentType["relationList"].push({
                            "type": relationalField.type,
                            "relation": Relationships.oneOnly
                        })

                        relationalField["relation"] = true
                        relationalField["relationType"] = Relationships.oneOnly
                        // Fk to target Pk id has to be added in the current currentType
                        let targetSQLTypeName = getSQLTableName(relationalField.type)
                        relationalField["foreign_key"] = {
                            "name": "Fk_" + relationalField.name + "_" + targetSQLTypeName + "_id",
                            "type": "int",
                            "noNull": relationalField.noNull,
                            "isArray": false,
                            "foreignKey": true,
                            "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + targetSQLTypeName + "_id\") REFERENCES \"" + targetSQLTypeName + "\" (\"Pk_" + targetSQLTypeName + "_id\")"
                        }
                    }
                    // ManyOnly
                    else if ((out == 0 && inn == 2) || (out == 2 && inn == 0)) {
                        currentType["relationList"].push({
                            "type": relationalField.type,
                            "relation": Relationships.manyOnly
                        })

                        relationalField["relationType"] = Relationships.manyOnly
                        // Fk to current Pk id has to be added in the targeted currentType
                        let targetType = types.filter(type => type.typeName == relationalField.type)
                        if (targetType.length != 1) {
                            console.error('Reference to currentType ' + relationalField.type + ' found 0 or several times')
                        } else {
                            // set relation status to each side of relation
                            relationalField["relation"] = true

                            // tracks the fk that were added to the targetType
                            relationalField["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName
                            relationalField["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id"
                            relationalField["delegated_field"]["side"] = "origin"


                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(relationalField))
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": relationalField.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id\") REFERENCES \"" + currentType.sqlTypeName + "\" (\"Pk_" + currentType.sqlTypeName + "_id\")"

                            }
                            delegatedField["delegated_field"]["state"] = true
                            delegatedField["name"] = "Fk_" + relationalField.name + "_" + currentType.sqlTypeName + "_id",
                                delegatedField["type"] = "Int"


                            // tracks the currentType who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = currentType.typeName
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = relationalField.name
                            delegatedField["delegated_field"]["side"] = "target"

                            // the field wont appear in model
                            relationalField["in_model"] = false


                            targetType[0].fields.push(delegatedField)

                        }
                    }
                    // Remove the relationship from the field : WHY ?
                    //currentType.fields = currentType.fields.filter((e) => e !== relationalField)
                }
            })
        }
    })

    // Todo filter manyToMany relationship to keep only 1 active side
    for (let index1 = 0; index1 < manyToMany.length; index1++) {
        // find a reciproq relationship
        for (let index2 = index1 + 1; index2 < manyToMany.length; index2++) {
            if (manyToMany[index1].relationship.type == manyToMany[index2].type.typeName && manyToMany[index2].relationship.directives.length > 0 && manyToMany[index2].relationship.directives.filter(directive => directive.name == 'hasInverse').length > 0) {
                manyToMany[index2].relationship.activeSide = false // Todo should be reported in the type object
                manyToMany[index2].relationship.joinTable = manyToMany[index1].relationship.joinTable
            } else {
                manyToMany[index2].relationship.activeSide = true
            }

        }
    }

    return types
}

/**
 * Build the list of join tables to add to the schema on top of standard object
 *
 * @returns Tables description
 * @param types
 */
export const getJoinTables = (types: IType[]) => {
    let result: any = []

    types.forEach(type => {
        if (type.typeName != "Query" && type.typeName != "Mutation" && type.typeName != "Subscription") {
            let rfields = getRelationalFields(type.fields)
            rfields.filter(field => field.relationType == Relationships.selfJoinMany).forEach(rfield => {
                let elt0 = getSQLTableName(type.typeName)
                let elt1 = getSQLTableName(rfield.type.toLowerCase())
                result.push({
                    name: type.typeName + "_" + rfield.type.toLowerCase() + "_" + rfield.name,
                    sqlname: elt0 + "_" + elt1 + "_" + rfield.name.toLowerCase(),
                    isJoinTable: true,
                    columns: [
                        {
                            field: elt0 + '_id',
                            fieldType: 'INTEGER',
                            constraint: 'FOREIGN KEY ("' + elt0 + '_id") REFERENCES "' + elt0 + '"("Pk_' + elt0 + '_id")'
                        }, {
                            field: rfield.name + '_id',
                            fieldType: 'INTEGER',
                            constraint: 'FOREIGN KEY ("' + rfield.name.toLowerCase() + '_id") REFERENCES "' + elt0 + '"("Pk_' + elt0 + '_id")'
                        },
                    ]
                })
            })
            rfields.filter(field => (field.relationType == Relationships.manyToMany && field.activeSide == true) || field.relationType == Relationships.manyToOne && field.joinTable.state).forEach(rfield => {
                let elt0 = getSQLTableName(type.typeName)
                let elt1 = getSQLTableName(rfield.type.toLowerCase())
                result.push({
                    name: type.typeName + "_" + rfield.type.toLowerCase() + "_" + rfield.name,
                    sqlname: elt0 + "_" + elt1 + "_" + rfield.name.toLowerCase(),
                    isJoinTable: true,
                    columns: [
                        {
                            field: elt0 + '_id',
                            fieldType: 'INTEGER',
                            constraint: 'FOREIGN KEY ("' + elt0 + '_id") REFERENCES "' + elt0 + '"("Pk_' + elt0 + '_id")'
                        }, {
                            field: rfield.name + '_id',
                            fieldType: 'INTEGER',
                            constraint: 'FOREIGN KEY ("' + rfield.name.toLowerCase() + '_id") REFERENCES "' + elt1 + '"("Pk_' + elt1 + '_id")'
                        },
                    ]
                })
            })
        }
    })
    return result
}

export const getQuerySelfJoinOne = (currentTypeName, fields) => {
    let result = ""
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT * FROM \"" + currentTypeName + "\" as t1 WHERE t1.\"Pk_Employe_id\" = (SELECT \"" + field.name.toLowerCase() + "_id\" FROM  \"" + currentTypeName + "\" WHERE \"" + currentTypeName + "\".\"Pk_" + currentTypeName + "_id\" = :value)"
        }
    })
    return result
}

export const getQuerySelfJoinMany = (currentTypeName, fields) => {
    let result = ""
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT t2.* FROM \"" + currentTypeName + "\" as t1 LEFT OUTER JOIN \"" + currentTypeName + "_" + field.name.toLowerCase() + "\" as joint ON t1.\"Pk_" + currentTypeName + "_id\" = joint.\"" + currentTypeName.toLowerCase() + "_id\" LEFT OUTER JOIN \"" + currentTypeName + "\" as t2 ON joint." + field.name.toLowerCase() + "_id = t2.\"Pk_" + currentTypeName + "_id\" WHERE t1.\"Pk_" + currentTypeName + "_id\" = :value '+sorting+' '+limit+' '+offset"
        }
    })
    return result
}

/** Fonctions utilitaires */

const getRelationalFields = (fields) => {
    const lst = fields.filter(field =>
        field.type != "String"
        && field.type != "ID"
        && field.type != "Int"
        && field.type != "Boolean"
        && !manageScalars.isScalar(field.type)
        && field.type != "foreign_key")
    return lst;
}

/**
 *
 * @param {*} fields Fields of the targeted object
 * @param {*} currentType Type being inspected
 * @returns 2 if relationship is [Type], 1 if relationship is Type, 0 if no relationship
 * @description Doesn't work if there is several time the same type referenced in the fileds !
 */
const getManyOrOne = (fields, currentType) => {
    for (let index = 0; index < fields.length; index++) {
        if (fields[index].type == currentType) {
            if (fields[index].isArray) {
                return 2;
            }
            return 1;
        }
    }
    return 0;
}

/**
 *
 * @param {*} element : Target type for the relation
 * @param {*} types : Types defined in the schema
 * @param {*} typeNames : Typenames defined in the schema
 * @param {*} currentType : Current Type being processed
 * @returns : 2 if relationship is [Type], 1 if relationship is Type, 0 if no relationship
 */
const getRelationOf = (element, types, typeNames, currentType) => {
    for (let index = 0; index < types.length; index++) {
        if (typeNames[index] == element) {
            let fields = types[index].fields
            return getManyOrOne(fields, currentType)
        }
    }
    return 0;
}