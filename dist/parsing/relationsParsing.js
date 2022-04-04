"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQuerySelfJoinMany = exports.getQuerySelfJoinOne = exports.getJoinTables = exports.getRelations = void 0;
/** Fonctions principales */
const relationships_1 = require("../constants/relationships");
const getSQLTableName_1 = require("../utils/getSQLTableName");
const manageScalars = require('../scalar-managment/manageScalars');
/**
 *  Compute relationships oneToMany, manyToMany, etc..
 * @param {*} types contains all types with associated attributes read from easygraphql-parser
 * @param {*} typenames names assocoated with each type
 * @param {*} scalarTypeNames scalar type name if type is one of them
 * @param {*} env allows to throw errors of not supported relations without stacktrace
 * @returns
 */
const getRelations = (types, scalarTypeNames, env) => {
    let typenames = types.map(type => type.typeName);
    let manyToMany = [];
    types.forEach(type => {
        if (type.typeName != "Query" && type.typeName != "Mutation" && type.typeName != "Subscription") {
            let rfields = getRelationalFields(type.fields, scalarTypeNames);
            rfields.forEach(rfield => {
                // we skip fields that were been added by other types ( ex: ManyOnly relation)
                if (!rfield["delegated_field"]["state"]) {
                    let out = getRelationOf(rfield.type, types, typenames, type.typeName);
                    let inn = getRelationOf(type.typeName, types, typenames, rfield.type);
                    if (out == 2 && inn == 2) { // Checking if self join (type related to itself)
                        if (rfield.type === type.typeName) {
                            type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.selfJoinMany });
                            rfield["relation"] = true;
                            rfield["relationType"] = relationships_1.Relationships.selfJoinMany;
                            rfield["activeSide"] = true;
                            // add info of jointable Associated
                            rfield["joinTable"]["state"] = true;
                            rfield["joinTable"]["name"] = type.typeName + "_" + rfield.type + "_" + rfield.name;
                            rfield["joinTable"]["contains"].push({
                                "fieldName": rfield.name.toLowerCase(),
                                "type": rfield.type,
                                "constraint": "FOREIGN KEY (\"" + rfield.name.toLowerCase() + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                            });
                            // add info about selfType
                            rfield["joinTable"]["contains"].push({
                                "fieldName": rfield.type.toLowerCase(),
                                "type": rfield.type,
                                "constraint": "FOREIGN KEY (\"" + rfield.type.toLowerCase() + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                            });
                            // the field wont appear in model
                            rfield["in_model"] = false;
                            // No addition needed for ManyToMany --> only through join table
                        }
                        else {
                            if (rfield.directives.length > 0 && rfield.directives.filter(directive => directive.name == 'hasInverse').length > 0) {
                                type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.manyToMany });
                                rfield["relation"] = true;
                                rfield["relationType"] = relationships_1.Relationships.manyToMany;
                                rfield["activeSide"] = true;
                                // add info of jointable Associated
                                rfield["joinTable"]["state"] = true;
                                rfield["joinTable"]["name"] = type.typeName + "_" + rfield.type + "_" + rfield.name;
                                rfield["joinTable"]["contains"].push({
                                    "fieldName": rfield.name.toLowerCase(),
                                    "type": rfield.type,
                                    "constraint": "FOREIGN KEY (\"" + rfield.name + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                                });
                                // gets the related field of join table in the other side thanks to hasInverseDirective info
                                let hasInverseFieldName = rfield.directives.filter(directive => directive.name == 'hasInverse')[0].args[0].value;
                                // push it into joinTable info
                                rfield["joinTable"]["contains"].push({
                                    "fieldName": type.typeName.toLowerCase(),
                                    "type": type.typeName,
                                    "constraint": "FOREIGN KEY (\"" + type.typeName.toLowerCase() + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "_id\")"
                                });
                                manyToMany.push({ "type": type, "relationship": rfield });
                                // the field wont appear in model
                                rfield["in_model"] = false;
                                // No addition needed for ManyToMany --> only through join table
                            }
                            else {
                                // standard manyToMany tables but we try to not duplicate tables from each side of relation
                                type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.manyToMany });
                                rfield["relation"] = true;
                                rfield["relationType"] = relationships_1.Relationships.manyToMany;
                                // add info of jointable Associated
                                rfield["joinTable"]["state"] = true;
                                rfield["joinTable"]["name"] = type.typeName + "_" + rfield.type + "_" + rfield.name;
                                rfield["joinTable"]["contains"].push({
                                    "fieldName": rfield.name.toLowerCase(),
                                    "type": rfield.type,
                                    "constraint": "FOREIGN KEY (\"" + rfield.name + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                                });
                                // push into jointable info about related type . field name is by default type name
                                // push it into joinTable info
                                rfield["joinTable"]["contains"].push({
                                    "fieldName": type.typeName.toLowerCase(),
                                    "type": type.typeName,
                                    "constraint": "FOREIGN KEY (\"" + type.typeName.toLowerCase() + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "_id\")"
                                });
                                manyToMany.push({ "type": type, "relationship": rfield });
                                // the field wont appear in model
                                rfield["in_model"] = false;
                                // todo : to be clarified
                            }
                        }
                    }
                    else if (out == 2 && inn == 1) {
                        type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.oneToMany });
                        rfield["relationType"] = relationships_1.Relationships.oneToMany;
                        // A Fk field has to be added to the targeted object
                        let targetType = types.filter(type => type.typeName == rfield.type);
                        if (targetType.length != 1) {
                            console.error('Reference to type ' + rfield.type + ' found 0 or several times');
                        }
                        else {
                            // set relation status to each side of relation
                            rfield["relation"] = true;
                            // tracks the fk that were added to the targetType
                            rfield["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName;
                            rfield["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id";
                            rfield["delegated_field"]["side"] = "origin";
                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(rfield));
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": rfield.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + type.sqlTypeName + "_id\") REFERENCES \"" + type.sqlTypeName + "\" (\"Pk_" + type.sqlTypeName + "_id\")"
                            };
                            delegatedField["delegated_field"]["state"] = true;
                            delegatedField["name"] = "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id",
                                delegatedField["type"] = "Int";
                            // tracks the type who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = type.typeName;
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = rfield.name;
                            delegatedField["delegated_field"]["side"] = "target";
                            // the field wont appear in model
                            rfield["in_model"] = false;
                            targetType[0].fields.push(delegatedField);
                        }
                    }
                    else if (out == 1 && inn == 2) {
                        type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.manyToOne });
                        rfield["relationType"] = relationships_1.Relationships.manyToOne;
                        // a Fk field has to be added to the current object
                        let targetType = types.filter(type => type.typeName == rfield.type);
                        rfield["relation"] = true;
                        // tracks the fk that were added to the targetType
                        rfield["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName;
                        rfield["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id";
                        rfield["delegated_field"]["side"] = "origin";
                        // if field is null, theres a composition relation, we create a joinTable
                        if (rfield.noNull) {
                            rfield["joinTable"]["state"] = true;
                            rfield["joinTable"]["name"] = type.typeName + "_" + rfield.type + "_" + rfield.name;
                            rfield["joinTable"]["contains"].push({
                                "fieldName": rfield.name,
                                "type": rfield.type,
                                "constraint": "FOREIGN KEY (\"" + rfield.name + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                            });
                            rfield["joinTable"]["contains"].push({
                                "fieldName": type.typeName.toLowerCase(),
                                "type": type.typeName,
                                "constraint": "FOREIGN KEY (\"" + type.typeName.toLowerCase() + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(type.typeName) + "_id\")"
                            });
                        }
                        // if field can be null, then we do classic processing
                        else {
                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(rfield));
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + rfield.name + "_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id",
                                "type": "int",
                                "noNull": rfield.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\") REFERENCES \"" + type.sqlTypeName + "\" (\"Pk_" + type.sqlTypeName + "_id\")"
                            };
                            delegatedField["delegated_field"]["state"] = true;
                            delegatedField["name"] = "Fk_" + rfield.name + "_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id",
                                delegatedField["type"] = "Int";
                            // tracks the type who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = type.typeName;
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = rfield.name;
                            delegatedField["delegated_field"]["side"] = "target";
                            targetType[0].fields.push(delegatedField);
                        }
                        // the field wont appear in model
                        rfield["in_model"] = false;
                    }
                    else if (out == 1 && inn == 1) {
                        // Checking if self join (type related to itself)
                        if (rfield.type === type.typeName) {
                            type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.selfJoinOne });
                            rfield["relation"] = true;
                            rfield["relationType"] = relationships_1.Relationships.selfJoinOne;
                            rfield["foreign_key"] = {
                                "name": "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": rfield.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + type.sqlTypeName + "_id\") REFERENCES \"" + type.sqlTypeName + "\" (\"Pk_" + type.sqlTypeName + "_id\")"
                            };
                        }
                        else {
                            // insert info about oneToOne relation to the target
                            let targetType = types.filter(type => type.typeName == rfield.type);
                            let targetField = targetType[0].fields.filter(field => field.type === type.typeName);
                            // Detects if a 1-1 relation is present. Not supported on sql
                            if (targetField[0].noNull && rfield.noNull) {
                                env.error("1-1 Relation not allowed, chekout \n" + rfield.name + " field on " + targetField[0].type + "\nor \n" + targetField[0].name + " field on " + rfield.type);
                            }
                            rfield["oneToOneInfo"] = {
                                "fkName": "Fk_" + targetField[0].name + "_" + (0, getSQLTableName_1.getSQLTableName)(targetField[0].type) + "_id"
                            };
                            type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.oneToOne });
                            rfield["relation"] = true;
                            rfield["relationType"] = relationships_1.Relationships.oneToOne;
                            // Both object has to integrate a Fk to Pk but each side is processed in each type
                            rfield["foreign_key"] = {
                                "name": "Fk_" + rfield.name + "_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id",
                                "type": "int",
                                "noNull": rfield.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\") REFERENCES \"" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "\" (\"Pk_" + (0, getSQLTableName_1.getSQLTableName)(rfield.type) + "_id\")"
                            };
                        }
                    }
                    // One only
                    else if ((out == 0 && inn == 1) || (out == 1 && inn == 0)) {
                        type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.oneOnly });
                        rfield["relation"] = true;
                        rfield["relationType"] = relationships_1.Relationships.oneOnly;
                        // Fk to target Pk id has to be added in the current type
                        let targetSQLTypeName = (0, getSQLTableName_1.getSQLTableName)(rfield.type);
                        rfield["foreign_key"] = {
                            "name": "Fk_" + rfield.name + "_" + targetSQLTypeName + "_id",
                            "type": "int",
                            "noNull": rfield.noNull,
                            "isArray": false,
                            "foreignKey": true,
                            "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + targetSQLTypeName + "_id\") REFERENCES \"" + targetSQLTypeName + "\" (\"Pk_" + targetSQLTypeName + "_id\")"
                        };
                    }
                    // ManyOnly
                    else if ((out == 0 && inn == 2) || (out == 2 && inn == 0)) {
                        type["relationList"].push({ "type": rfield.type, "relation": relationships_1.Relationships.manyOnly });
                        rfield["relationType"] = relationships_1.Relationships.manyOnly;
                        // Fk to current Pk id has to be added in the targeted type
                        let targetType = types.filter(type => type.typeName == rfield.type);
                        if (targetType.length != 1) {
                            console.error('Reference to type ' + rfield.type + ' found 0 or several times');
                        }
                        else {
                            // set relation status to each side of relation
                            rfield["relation"] = true;
                            // tracks the fk that were added to the targetType
                            rfield["delegated_field"]["associatedWith"]["type"] = targetType[0].typeName;
                            rfield["delegated_field"]["associatedWith"]["fieldName"] = "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id";
                            rfield["delegated_field"]["side"] = "origin";
                            // copy all info from field to fk to be added in targetType
                            let delegatedField = JSON.parse(JSON.stringify(rfield));
                            // delegated field is a foreign Key
                            delegatedField["foreign_key"] = {
                                "name": "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id",
                                "type": "int",
                                "noNull": rfield.noNull,
                                "isArray": false,
                                "foreignKey": true,
                                "constraint": "FOREIGN KEY (\"Fk_" + rfield.name + "_" + type.sqlTypeName + "_id\") REFERENCES \"" + type.sqlTypeName + "\" (\"Pk_" + type.sqlTypeName + "_id\")"
                            };
                            delegatedField["delegated_field"]["state"] = true;
                            delegatedField["name"] = "Fk_" + rfield.name + "_" + type.sqlTypeName + "_id",
                                delegatedField["type"] = "Int";
                            // tracks the type who added the Fk
                            delegatedField["delegated_field"]["associatedWith"]["type"] = type.typeName;
                            delegatedField["delegated_field"]["associatedWith"]["fieldName"] = rfield.name;
                            delegatedField["delegated_field"]["side"] = "target";
                            // the field wont appear in model
                            rfield["in_model"] = false;
                            targetType[0].fields.push(delegatedField);
                        }
                    }
                    // Remove the relationship from the field : WHY ?
                    //type.fields = type.fields.filter((e) => e !== rfield)
                }
            });
        }
    });
    // Todo filter manyToMany relationship to keep only 1 active side
    for (let index1 = 0; index1 < manyToMany.length; index1++) {
        // find a reciproq relationship
        for (let index2 = index1 + 1; index2 < manyToMany.length; index2++) {
            if (manyToMany[index1].relationship.type == manyToMany[index2].type.typeName && manyToMany[index2].relationship.directives.length > 0 && manyToMany[index2].relationship.directives.filter(directive => directive.name == 'hasInverse').length > 0) {
                manyToMany[index2].relationship.activeSide = false; // Todo should be reported in the type object
                manyToMany[index2].relationship.joinTable = manyToMany[index1].relationship.joinTable;
            }
            else {
                manyToMany[index2].relationship.activeSide = true;
            }
        }
    }
    return types;
};
exports.getRelations = getRelations;
/**
 * Build the list of join tables to add to the schema on top of standard object
 *
 * @param {*} List of types as return by easygraphql-parser and enrich by determining relationship kinds on each field
 * @param {*} scalarTypeNames
 * @returns Tables description
 */
const getJoinTables = (types, scalarTypeNames) => {
    let result = [];
    types.forEach(type => {
        if (type.typeName != "Query" && type.typeName != "Mutation" && type.typeName != "Subscription") {
            let rfields = getRelationalFields(type.fields, scalarTypeNames);
            rfields.filter(field => field.relationType == relationships_1.Relationships.selfJoinMany).forEach(rfield => {
                let elt0 = (0, getSQLTableName_1.getSQLTableName)(type.typeName);
                let elt1 = (0, getSQLTableName_1.getSQLTableName)(rfield.type.toLowerCase());
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
                });
            });
            rfields.filter(field => (field.relationType == relationships_1.Relationships.manyToMany && field.activeSide == true) || field.relationType == relationships_1.Relationships.manyToOne && field.joinTable.state).forEach(rfield => {
                let elt0 = (0, getSQLTableName_1.getSQLTableName)(type.typeName);
                let elt1 = (0, getSQLTableName_1.getSQLTableName)(rfield.type.toLowerCase());
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
                });
            });
        }
    });
    return result;
};
exports.getJoinTables = getJoinTables;
const getQuerySelfJoinOne = (currentTypeName, fields) => {
    let result = "";
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT * FROM \"" + currentTypeName + "\" as t1 WHERE t1.\"Pk_Employe_id\" = (SELECT \"" + field.name.toLowerCase() + "_id\" FROM  \"" + currentTypeName + "\" WHERE \"" + currentTypeName + "\".\"Pk_" + currentTypeName + "_id\" = :value)";
        }
    });
    return result;
};
exports.getQuerySelfJoinOne = getQuerySelfJoinOne;
const getQuerySelfJoinMany = (currentTypeName, fields) => {
    let result = "";
    fields.forEach(field => {
        if (field.type === currentTypeName) {
            result += "SELECT t2.* FROM \"" + currentTypeName + "\" as t1 LEFT OUTER JOIN \"" + currentTypeName + "_" + field.name.toLowerCase() + "\" as joint ON t1.\"Pk_" + currentTypeName + "_id\" = joint.\"" + currentTypeName.toLowerCase() + "_id\" LEFT OUTER JOIN \"" + currentTypeName + "\" as t2 ON joint." + field.name.toLowerCase() + "_id = t2.\"Pk_" + currentTypeName + "_id\" WHERE t1.\"Pk_" + currentTypeName + "_id\" = :value '+sorting+' '+limit+' '+offset";
        }
    });
    return result;
};
exports.getQuerySelfJoinMany = getQuerySelfJoinMany;
/** Fonctions utilitaires */
const getRelationalFields = (fields, scalarTypeNames) => {
    const lst = fields.filter(field => field.type != "String" && field.type != "ID" && field.type != "Int" && field.type != "Boolean" && !manageScalars.isScalar(field.type) && field.type != "foreign_key");
    return lst;
};
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
};
/**
 *
 * @param {*} element : Target type for the relation
 * @param {*} types : Types defined in the schema
 * @param {*} typenames : Typenames defined in the schema
 * @param {*} currentType : Current Type being processed
 * @returns : 2 if relationship is [Type], 1 if relationship is Type, 0 if no relationship
 */
const getRelationOf = (element, types, typenames, currentType) => {
    for (let index = 0; index < types.length; index++) {
        if (typenames[index] == element) {
            let fields = types[index].fields;
            return getManyOrOne(fields, currentType);
        }
    }
    return 0;
};
