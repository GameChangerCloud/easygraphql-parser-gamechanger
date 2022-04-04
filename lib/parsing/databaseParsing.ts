const manageScalars = require('../scalar-managment/manageScalars')
/** Fonctions principales */
/** DATABASE (tables, init, fill, drop) */

// Tables
// Get all the tables, with columns, based on the types we have
export const getAllTables = (types, scalarTypeNames) => {
    let allTables: any = []
    let typesNameArray = types.map(type => type.typeName)
    types.forEach(type => {
        let tableTemp: any = []
        // Fill up the infos on scalar field (int, string, etc.)
        if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription"  && !manageScalars.isScalar(type.typeName)) {
            //get scalar field infos
            tableTemp.push(...manageScalars.getScalarFieldInfo(type, typesNameArray))

            allTables.push({ name: type.typeName, sqlname: type.sqlTypeName, columns: tableTemp, isJoinTable: false })
        }
    })

    return allTables
}

export const getInitEachModelsJS = (tables) => {
    let s = '';
    tables.forEach(table => {
        s += 'init' + table.name + '()\n'
    })
    return s;
}

export const getInitEachFieldsModelsJS = (types) => {
    let s = '';
    s += getInitEachModelsFields(types);
    s += '\n\n'
    return s;
}

/** Fonctions utilitaires */

const getInitEachModelsFields = (types) => {
    let s = '';
    types.forEach(type => {
        if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription") {
            let nameList = type.typeName.toLowerCase()
            s += 'for(let i = 0; i < ' + nameList + 'Tab.length; i++){\n\t' + nameList + 'Tab[i] = update' + type.typeName + '(' + nameList + 'Tab[i], i);\n}';
        }
    })
    return s;
}