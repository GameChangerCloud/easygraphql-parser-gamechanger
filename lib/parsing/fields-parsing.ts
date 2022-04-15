/** Fonctions principales */

import { Relationships } from "../constants/relationships";
import { getFieldCreate, getFieldName } from "../scalar-managment/manage-scalars";
import pluralize from 'pluralize'
import {IType} from "../models/type";

/**
 * From the fields object, transform the syntax to get the right one to print on final type.js file. Return a string
 * @param {*} currentTypeName
 * @param {*} fields
 * @param {*} type
 * @param {*} relations
 * @param {*} manyToManyTables
 * @param {*} typesName
 * @param {*} defaultScalarsType
 * @returns
 */
export const getFieldsParsed = (type: IType, manyToManyTables: any[], typesName: string[], defaultScalarsType: string[]) => {
    let result = "";
    for (let index = 0; index < type.fields.length; index++) {
        let field = type.fields[index];
        let hasArguments = field.arguments[0] ? true : false;
        if (index > 0)
            result += "\t\t";
        switch (field.type) {
            case "ID":
                if (type.typeName === "Mutation" || type.typeName === "Query" || type.typeName === "Subscription") {
                    result += buildTypeField(field, "GraphQLID", true);
                    result += "\n";
                    result += buildArgs(field.arguments, hasArguments);
                    result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                    result += "\n\t\t},\n";
                }
                else {
                    result += buildTypeField(field, "GraphQLID", false);
                }
                break;
            case "String":
                if (type.typeName === "Mutation" || type.typeName === "Query" || type.typeName === "Subscription") {
                    result += buildTypeField(field, "GraphQLString", true);
                    result += "\n";
                    result += buildArgs(field.arguments, hasArguments);
                    result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                    result += "\n\t\t},\n";
                }
                else {
                    result += buildTypeField(field, "GraphQLString", false);
                }
                break;
            case "Int":
                if (type.typeName === "Mutation" || type.typeName === "Query" || type.typeName === "Subscription") {
                    result += buildTypeField(field, "GraphQLInt", true);
                    result += "\n";
                    result += buildArgs(field.arguments, hasArguments);
                    result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                    result += "\n\t\t},\n";
                }
                else {
                    result += buildTypeField(field, "GraphQLInt", false);
                }
                break;
            case "Boolean":
                if (type.typeName === "Mutation" || type.typeName === "Query" || type.typeName === "Subscription") {
                    result += buildTypeField(field, "GraphQLBoolean", true);
                    result += "\n";
                    result += buildArgs(field.arguments, hasArguments);
                    result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                    result += "\n\t\t},\n";
                }
                else {
                    result += buildTypeField(field, "GraphQLBoolean", false);
                }
                break;
            // Not classic scalar type
            default:
                if (type.typeName === "Query") { // If query, we do not accept reserved field query (e.g <entity> or <entities>)
                    if (isValidFieldQuery(field.name, typesName)) {
                        if (field.type === "String" || field.type === "Int" || field.type === "Boolean" || field.type === "ID" || defaultScalarsType.includes(field.type))
                            result += buildTypeField(field, field.type, true);
                        else
                            result += buildTypeField(field, field.type + "Type", true);
                        result += "\n";
                        result += buildArgs(field.arguments, hasArguments);
                        result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                        result += "\n\t\t},\n";
                    }
                }
                else if (type.typeName === "Mutation") {
                    if (isValidFieldMutation(field.name, typesName)) {
                        if (field.type === "String" || field.type === "Int" || field.type === "Boolean" || field.type === "ID" || defaultScalarsType.includes(field.type))
                            result += buildTypeField(field, field.type, true);
                        else
                            result += buildTypeField(field, field.type + "Type", true);
                        result += "\n";
                        result += buildArgs(field.arguments, hasArguments);
                        result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\t // To define \n\t\t\t}";
                        result += "\n\t\t},\n";
                    }
                }
                else {
                    if (defaultScalarsType.includes(field.type)) {
                        result += buildTypeField(field, field.type, true);
                        result += "\n";
                        result += buildResolver(field, false, null, null, null);
                        result += "\n\t\t},\n";
                    }
                    else { // If it's an interface, different based resolver
                        if (type.type === "InterfaceTypeDefinition") {
                            result += buildResolverInterface();
                        }
                        else {
                            result += buildTypeField(field, field.type + "Type", true);
                            result += "\n";
                            result += buildArgs(field.arguments, hasArguments);
                            // get the relation
                            let relationsBetween = field.relationType; //getRelationBetween(field.type, type.typeName, relations)
                            if (relationsBetween === "manyToMany") {
                                let manyToManyTable = getManyToManyTableBetween(type.typeName, field.type, manyToManyTables);
                                result += buildResolver(field, hasArguments, type.typeName, relationsBetween, null);
                            }
                            else {
                                result += buildResolver(field, hasArguments, type.typeName, relationsBetween, null);
                            }
                        }
                        result += "\n\t\t},\n";
                    }
                }
        }
    }
    return result;
};

export const getFieldsInput = (fields) => {
    let result = "";
    for (let index = 0; index < fields.length; index++) {
        let field = fields[index];
        let hasArguments = field.arguments[0] ? true : false;
        if (index > 0)
            result += "\t\t";
        switch (field.type) {
            case "ID":
                result += buildTypeField(field, "GraphQLID", false);
                break;
            case "String":
                result += buildTypeField(field, "GraphQLString", false);
                break;
            case "Int":
                result += buildTypeField(field, "GraphQLInt", false);
                break;
            case "Boolean":
                result += buildTypeField(field, "GraphQLBoolean", false);
                break;
            // Not classic scalar type
            default:
                if (field.isArray) {
                    result += buildTypeField(field, field.type + "UpdateInput", false);
                }
                else {
                    result += field.name + ": { type: GraphQLID },\n";
                }
        }
    }
    return result;
};

/** TYPE HANDLER */
export const getFieldsParsedHandler = (currentTypeName, fields, isOneToOneChild, parent) => {
    let result = "";
    for (let index = 0; index < fields.length; index++) {
        if (fields[index].name === "id") {
            if (!isOneToOneChild)
                result += "\t\t\t" + fields[index].name + ": data.Pk_" + currentTypeName + "_id";
            else
                result += "\t\t\t" + fields[index].name + ": data.Pk_" + parent + "_id";
        }
        else {
            result += "\t\t\t" + fields[index].name + ": data." + fields[index].name;
        }
        if (index < fields.length - 1)
            result += ",";
        result += "\n";
    }
    return result;
};

export const getFieldsCreate = (currentTypeName, fields, relations, manyToManyTables) => {
    let sqlFields:any[] = [];
    // Deal with scalar first (removing any Array)
    fields.filter(field => !field.isArray && field.delegated_field.side !== "target").forEach(field => {
        let sqlField = getFieldCreate(field.type, field.name);
        if (sqlField) {
            sqlFields.push(sqlField);
        }
    });
    // Deal with oneOnly relationship
    fields.filter(field1 => field1.relationType == Relationships.oneOnly || field1.relationType == Relationships.selfJoinOne).forEach(field2 => {
        sqlFields.push(`args.${field2.name}`);
    });
    // Deal with oneToOne relationship
    fields.filter(field1 => field1.relationType == Relationships.oneToOne && field1.noNull).forEach(field2 => {
        sqlFields.push(`args.${field2.name}`);
    });
    return sqlFields.filter(field => !field.includes("args.id")).join(` + "," + `);
};

export const getFieldsName = (tables, fields, currentTypeName, currentSQLTypeName, relations) => {
    let sqlNames: any[] = [];
    // Deal with scalar first (removing any Array)
    fields.filter(field => !field.isArray && field.delegated_field.side !== "target").forEach(field => {
        let sqlName = getFieldName(field.type, field.name, currentTypeName);
        if (sqlName)
            sqlNames.push(sqlName);
    });
    // Deal with oneOnly relationship
    fields.filter(field1 => field1.relationType == Relationships.oneOnly || field1.relationType == Relationships.selfJoinOne).forEach(field2 => {
        sqlNames.push("\\\"" + field2.foreign_key.name + "\\\"");
    });
    //Deal with OneToOne not null side RelationShip
    fields.filter(field1 => field1.relationType == Relationships.oneToOne && field1.noNull).forEach(field2 => {
        sqlNames.push("\\\"" + field2.foreign_key.name + "\\\"");
    });
    return sqlNames.filter(field => !field.includes("\"Pk_")).join(",");
};

/** Fonctions utilitaires */

const isValidFieldQuery = (fieldName, typesName) => {
    let res = true;
    typesName.map(typeName => {
        if (fieldName === typeName || fieldName === pluralize.plural(typeName) || fieldName === typeName.toLowerCase() || fieldName === pluralize.plural(typeName.toLowerCase())) {
            res = false;
        }
    });
    return res;
};

const isValidFieldMutation = (fieldName, typesName) => {
    let res = true;
    typesName.map(typeName => {
        if (fieldName === typeName + "Create" || fieldName === typeName + "Update" || fieldName === typeName + "Delete") {
            res = false;
        }
    });
    return res;
};

// Construct the types, return a string
const buildTypeField = (field, type, needResolved) => {
    let result = needResolved ? field.name + ": { \n\t\t\ttype: " : field.name + ": { type: ";
    let parentheses = "";
    if (field.isArray) {
        if (field.noNull) {
            result += "new GraphQLNonNull(";
            parentheses += ")";
        }
        result += "new GraphQLList(";
        parentheses += ")";
        if (field.noNullArrayValues) {
            result += "new GraphQLNonNull(";
            parentheses += ")";
        }
        result += type;
    }
    else {
        if (field.noNull) {
            result += "new GraphQLNonNull(";
            parentheses += ")";
        }
        result += type;
    }
    result += needResolved ? parentheses + "," : parentheses + " },\n";
    return result;
};

// Construct the arguments, return a string
const buildArgs = (parameters, hasArguments) => {
    let result = "";
    if (hasArguments) {
        result += "\t\t\targs: {\n";
        parameters.forEach(param => {
            result += "\t\t\t\t";
            switch (param.type) {
                case "ID":
                    result += buildTypeField(param, "GraphQLID", false);
                    break;
                case "String":
                    result += buildTypeField(param, "GraphQLString", false);
                    break;
                case "Int":
                    result += buildTypeField(param, "GraphQLInt", false);
                    break;
                default:
                    result += buildTypeField(param, param.type + "Type", false);
                    break;
            }
        });
        result += "\t\t\t},\n";
    }
    return result;
};

// Construct the resolver based on the type field, return a string
const buildResolver = (field, hasArguments, currentTypeName, relationType, manyToManyTable) => {
    let result = "";
    if (hasArguments) {
        result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\treturn dbHandler.handleGet(args, '" + field.type + "Type')\n\t\t\t}";
    }
    else {
        if (currentTypeName !== "Query") {
            if (manyToManyTable != null) {
                result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\treturn dbHandler.handleGet({parentId: obj.id, parentTypeName: info.parentType, relationType: \"" + relationType + "\", tableJunction: \"" + manyToManyTable.sqlname + "\"}, '" + field.type + "Type')\n\t\t\t}";
            }
            else {
                if (!relationType) {
                    // TODO check if other scalar type need casting from being fetch from postgres table
                    if (field.type === "DateTime" || field.type === "Date" || field.type === "Date") {
                        result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\treturn new Date(obj." + field.name + ")\n\t\t\t}"; // Cast into a Date object
                    }
                }
                else {
                    result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\tlet result = dbHandler.handleGet({parentId: obj.id, parentTypeName: info.parentType, relationType: \"" + relationType + "\"}, '" + field.type + "Type').then((data) => {\n\t\t\t\treturn data\n\t\t\t})\n\t\t\treturn result\n\t\t\t}";
                }
            }
        }
        else {
            result += "\t\t\tresolve: (obj, args, context, info) => {\n\t\t\t\treturn dbHandler.handleGet(null, '" + field.type + "Type')\n\t\t\t}";
        }
    }
    return result;
};

// Construct the resolver for interface
const buildResolverInterface = () => {
    let result = "";
    result += "\t\t\tresolve: (obj, args, context) => {\n\t\t\t\treturn resolveType(args)\n\t\t\t}";
    return result;
};

const getManyToManyTableBetween = (typeOne, typeTwo, manyToManyTables) => {
    let result = "";
    manyToManyTables.forEach(table => {
        if (table.name.includes(typeOne) && table.name.includes(typeTwo)) {
            result = table;
            return result;
        }
    });
    return result;
};