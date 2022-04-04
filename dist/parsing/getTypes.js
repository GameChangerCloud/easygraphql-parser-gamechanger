"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTypesExceptQueries = exports.getAllTypesName = exports.getAllTypes = void 0;
const getSQLTableName_1 = require("../utils/getSQLTableName");
/**
 * From the schema, fetch all the types object and return an array of it
 * @param {*} schemaJSON
 * @returns
 */
const getAllTypes = (schemaJSON) => {
    let types = [];
    for (const type in schemaJSON) {
        types.push(schemaJSON[type]);
        schemaJSON[type]["typeName"] = type;
        schemaJSON[type]["sqlTypeName"] = (0, getSQLTableName_1.getSQLTableName)(type);
    }
    return types;
};
exports.getAllTypes = getAllTypes;
const getAllTypesName = (schemaJSON) => {
    let typesName = [];
    for (const typeName in schemaJSON) {
        if (typeName !== "Query" && typeName !== "Mutation")
            typesName.push(typeName);
    }
    return typesName;
};
exports.getAllTypesName = getAllTypesName;
const getTypesExceptQueries = (schemaJSON) => {
    let types = [];
    for (const type in schemaJSON) {
        if (type !== "Query" && type !== "Mutation")
            types.push(schemaJSON[type]);
        schemaJSON[type]["typeName"] = type;
    }
    return types;
};
exports.getTypesExceptQueries = getTypesExceptQueries;
