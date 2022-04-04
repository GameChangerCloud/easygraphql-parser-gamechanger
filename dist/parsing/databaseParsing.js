"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInitEachFieldsModelsJS = exports.getInitEachModelsJS = exports.getAllTables = void 0;
const manageScalars = require('../scalar-managment/manageScalars');
/** Fonctions principales */
/** DATABASE (tables, init, fill, drop) */
// Tables
// Get all the tables, with columns, based on the types we have
const getAllTables = (types, scalarTypeNames) => {
    let allTables = [];
    let typesNameArray = types.map(type => type.typeName);
    types.forEach(type => {
        let tableTemp = [];
        // Fill up the infos on scalar field (int, string, etc.)
        if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription" && !manageScalars.isScalar(type.typeName)) {
            //get scalar field infos
            tableTemp.push(...manageScalars.getScalarFieldInfo(type, typesNameArray));
            allTables.push({ name: type.typeName, sqlname: type.sqlTypeName, columns: tableTemp, isJoinTable: false });
        }
    });
    return allTables;
};
exports.getAllTables = getAllTables;
const getInitEachModelsJS = (tables) => {
    let s = '';
    tables.forEach(table => {
        s += 'init' + table.name + '()\n';
    });
    return s;
};
exports.getInitEachModelsJS = getInitEachModelsJS;
const getInitEachFieldsModelsJS = (types) => {
    let s = '';
    s += getInitEachModelsFields(types);
    s += '\n\n';
    return s;
};
exports.getInitEachFieldsModelsJS = getInitEachFieldsModelsJS;
/** Fonctions utilitaires */
const getInitEachModelsFields = (types) => {
    let s = '';
    types.forEach(type => {
        if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription") {
            let nameList = type.typeName.toLowerCase();
            s += 'for(let i = 0; i < ' + nameList + 'Tab.length; i++){\n\t' + nameList + 'Tab[i] = update' + type.typeName + '(' + nameList + 'Tab[i], i);\n}';
        }
    });
    return s;
};
