/** Fonctions principales */
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
export declare const getFieldsParsed: (type: any, manyToManyTables: any, typesName: any, defaultScalarsType: any) => string;
export declare const getFieldsInput: (fields: any) => string;
/** TYPE HANDLER */
export declare const getFieldsParsedHandler: (currentTypeName: any, fields: any, isOneToOneChild: any, parent: any) => string;
export declare const getFieldsCreate: (currentTypeName: any, fields: any, relations: any, manyToManyTables: any) => string;
export declare const getFieldsName: (tables: any, fields: any, currentTypeName: any, currentSQLTypeName: any, relations: any) => string;
