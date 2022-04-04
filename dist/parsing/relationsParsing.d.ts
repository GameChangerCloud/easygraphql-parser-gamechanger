/**
 *  Compute relationships oneToMany, manyToMany, etc..
 * @param {*} types contains all types with associated attributes read from easygraphql-parser
 * @param {*} typenames names assocoated with each type
 * @param {*} scalarTypeNames scalar type name if type is one of them
 * @param {*} env allows to throw errors of not supported relations without stacktrace
 * @returns
 */
export declare const getRelations: (types: any, scalarTypeNames: any, env: any) => any;
/**
 * Build the list of join tables to add to the schema on top of standard object
 *
 * @param {*} List of types as return by easygraphql-parser and enrich by determining relationship kinds on each field
 * @param {*} scalarTypeNames
 * @returns Tables description
 */
export declare const getJoinTables: (types: any, scalarTypeNames: any) => any;
export declare const getQuerySelfJoinOne: (currentTypeName: any, fields: any) => string;
export declare const getQuerySelfJoinMany: (currentTypeName: any, fields: any) => string;
