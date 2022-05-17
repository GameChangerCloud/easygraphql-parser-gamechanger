import {Type} from "../models/type";
/** Fonctions principales */
/** DATABASE (tables, init, fill, drop) */

// Tables
// Get all the tables, with columns, based on the types we have
export const getAllTables = (types: Type[]) => {
    let allTables: any = []
    let typesNameArray: string[] = types.map(type => type.typeName)
    types.forEach(currentType => {
        let tableTemp: any = []
        // Fill up the infos on scalar field (int, string, etc.)
        if (currentType.isNotOperation() && currentType.type === "ObjectTypeDefinition") {
            //get scalar field infos
            tableTemp.push(...getScalarFieldInfo(currentType))

            allTables.push({
                name: currentType.typeName,
                sqlName: currentType.sqlTypeName,
                columns: tableTemp,
                isJoinTable: false
            })
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
        if (type.isNotOperation()) {
            let nameList = type.typeName.toLowerCase()
            s += 'for(let i = 0; i < ' + nameList + 'Tab.length; i++){\n\t' + nameList + 'Tab[i] = update' + type.typeName + '(' + nameList + 'Tab[i], i);\n}';
        }
    })
    return s;
}

const getScalarFieldInfo = (currentType: Type) => {
    return currentType.fields
        .filter(currentField => currentField.in_model)
        .map(currentField => {
            if (currentField.foreign_key) {
                let foreignKey = currentField.foreign_key;
                return {
                    field: foreignKey.name,
                    fieldType: foreignKey.type,
                    unique: false,
                    constraint: foreignKey.constraint,
                    isArray: false,
                    gqlType: foreignKey.type,
                    noNull: foreignKey.noNull,
                    noNullArrayValues: false
                }
            } else {
                return {
                    field: currentField.type === "ID" ? "Pk_" + currentType.sqlTypeName + "_id" : currentField.name,
                    fieldType: currentField.sqlType,
                    unique: false,
                    constraint: currentField.type === "ID" ? "SERIAL PRIMARY KEY" : null,
                    isArray: currentField.isArray,
                    gqlType: currentField.type,
                    noNull: currentField.noNull,
                    noNullArrayValues: currentField.noNullArrayValues
                }
            }
        })
}