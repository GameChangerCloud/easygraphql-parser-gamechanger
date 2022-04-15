import {IType} from "../models/type";
import {Scalars} from "../constants/scalar";
import {isBasicType, isScalar} from "../scalar-managment/manage-scalars";
/** Fonctions principales */
/** DATABASE (tables, init, fill, drop) */

// Tables
// Get all the tables, with columns, based on the types we have
export const getAllTables = (types) => {
    let allTables: any = []
    let typesNameArray = types.map(type => type.typeName)
    types.forEach(type => {
        let tableTemp: any = []
        // Fill up the infos on scalar field (int, string, etc.)
        if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription" && !isScalar(type.typeName)) {
            //get scalar field infos
            tableTemp.push(...getScalarFieldInfo(type, typesNameArray))

            allTables.push({name: type.typeName, sqlname: type.sqlTypeName, columns: tableTemp, isJoinTable: false})
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

const getScalarFieldInfo = (currentType: IType, typesNameArray: string[]) => {
    let tableTemp: any[] = []
    currentType.fields.forEach(field => {
        let fieldType = field.type
        let fieldIsArray = field.isArray
        if (!typesNameArray.includes(fieldType) && field["in_model"] && isBasicType(fieldType)) {
            if (fieldType === "ID") {
                tableTemp.push({
                    field: "Pk_" + currentType.sqlTypeName + "_id",
                    fieldType: "int",
                    unique: false,
                    constraint: "SERIAL PRIMARY KEY NOT NULL",
                    isArray: fieldIsArray,
                    gqlType: fieldType,
                    noNull: field.noNull,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = "int"
            } else if (fieldType === "String") {
                tableTemp.push({
                    field: field.name,
                    fieldType: "text",
                    unique: false,
                    constraint: null,
                    isArray: fieldIsArray,
                    gqlType: fieldType,
                    noNull: field.noNull,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = "text"
            } else if (fieldType === "Int") {
                tableTemp.push({
                    field: field.name,
                    fieldType: "int",
                    unique: false,
                    constraint: null,
                    isArray: fieldIsArray,
                    gqlType: fieldType,
                    noNull: field.noNull,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = "int"
            } else if (fieldType === "Boolean") {
                tableTemp.push({
                    field: field.name,
                    fieldType: "boolean",
                    unique: false,
                    constraint: null,
                    isArray: fieldIsArray,
                    gqlType: fieldType,
                    noNull: field.noNull,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = "boolean"
            } else if (fieldType === "Float") {
                tableTemp.push({
                    field: field.name,
                    fieldType: "float8",
                    unique: false,
                    constraint: null,
                    isArray: fieldIsArray,
                    gqlType: fieldType,
                    noNull: field.noNull,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = "float8"
            } else { // handle added  foreign_keys by other types ( detected as Int)
                let fkInfo = field.foreign_key
                tableTemp.push({
                    field: fkInfo.name,
                    fieldType: fkInfo.type,
                    noNull: fkInfo.noNull,
                    unique: false,
                    constraint: fkInfo.constraint,
                    isArray: fkInfo.isArray,
                    gqlType: fkInfo.type,
                    noNullArrayValues: field.noNullArrayValues
                })
            }
        } else if (fieldType in Scalars) {
            switch (fieldType) {
                case Scalars.Date:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "date",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "date"
                    break
                case Scalars.Time:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "time",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "time"
                    break
                case Scalars.DateTime:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "timestamp",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "timestamp"
                    break
                case Scalars.NonPositiveFloat:
                case Scalars.PositiveFloat:
                case Scalars.NonNegativeFloat:
                case Scalars.NegativeFloat:
                case Scalars.UnsignedFloat:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "float8",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "float8"
                    break
                case Scalars.BigInt:
                case Scalars.Long:
                case Scalars.Port:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "int8",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "int8"
                    break
                case Scalars.GUID:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "uuid",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "uuid"
                    break
                case Scalars.IPv4:
                case Scalars.IPv6:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "inet",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "inet"
                    break
                case Scalars.MAC:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "macaddr",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "macaddr"
                    break
                case Scalars.USCurrency:
                case Scalars.Currency:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "money",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "money"
                    break
                case Scalars.JSON:
                case Scalars.JSONObject:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "json",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "json"
                    break
                case Scalars.Byte:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "bytea",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "bytea"
                    break
                case Scalars.LineString:
                case Scalars.Point:
                case Scalars.Polygon:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "geometry",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "geometry"
                    break
                case Scalars.UtcOffset:
                case Scalars.EmailAddress:
                case Scalars.URL:
                case Scalars.PhoneNumber:
                case Scalars.PostalCode:
                case Scalars.HexColorCode:
                case Scalars.HSL:
                case Scalars.HSLA:
                case Scalars.NonPositiveInt:
                case Scalars.PositiveInt:
                case Scalars.NonNegativeInt:
                case Scalars.NegativeInt:
                case Scalars.UnsignedInt:
                case Scalars.RGB:
                    tableTemp.push({
                        field: field.name,
                        fieldType: "int",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "int"
                    break
                case Scalars.ISBN:
                case Scalars.RGBA:
                default:
                    // By default, scalar type other than the ones that have specific column type in postgres, it's up to the final user to modify the final field type in the table
                    tableTemp.push({
                        field: field.name,
                        fieldType: "text",
                        unique: false,
                        constraint: null,
                        isArray: fieldIsArray,
                        gqlType: fieldType,
                        noNull: field.noNull,
                        noNullArrayValues: field.noNullArrayValues
                    })
                    field.sqlType = "text"
                    break
            }
        } else { // handle types who are traduced into foreignkeys
            if (field.foreign_key !== null && field.in_model) {
                let fkInfo = field.foreign_key
                tableTemp.push({
                    field: fkInfo.name,
                    fieldType: fkInfo.type,
                    unique: false,
                    constraint: fkInfo.constraint,
                    isArray: fkInfo.isArray,
                    gqlType: fkInfo.type,
                    noNullArrayValues: field.noNullArrayValues
                })
                field.sqlType = fkInfo.type
            }
        }
    })

    return tableTemp

}