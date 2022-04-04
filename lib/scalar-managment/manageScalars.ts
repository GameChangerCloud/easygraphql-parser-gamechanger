import {Type} from "../models/Type";

const scalars = require('../constants/scalar')
const utils = require('../utils/getSQLTableName')

export const isScalar = (typeName: string) => {
    return typeName in scalars ||
        typeName === 'String' ||
        typeName === 'ID' ||
        typeName === 'Int' ||
        typeName === 'Boolean' ||
        typeName === 'Float';
}

export const isBasicType = (typeName: string) => {
    return typeName === 'String' ||
        typeName === 'ID' ||
        typeName === 'Int' ||
        typeName === 'Boolean' ||
        typeName === 'Float';
}

export const getFieldCreate = (type: string, name: string) => {
    let str =  ""
    switch (type) {
        case "ID":
        case "Boolean":
        case "Int":
            str = `args.${name}`
            break
        case "String":
        case "Date":
        case "RGB":
        case "RGBA":
        case "HSL":
        case "HSLA":
        case "HexColorCode":
        case "Time":
            str = `utils.escapeQuote(args.${name})`
            break
        case "DateTime":
            str = `"'" + args.${name}.toISOString() + "'"`
            break
        default:
            if (scalars[type]) {
                str = `args.${name}`
            }
            break;
    }
    return str
}

export const getFieldName = (scalar : string, name : string, type : string) => {
    let str =  ""
    switch (scalar) {
        case "ID":
            str = "\\\"Pk_" + utils.getSQLTableName(type) + "_id\\\""
            break;
        case "Boolean":
        case "Int":
        case "String":
        case "Date":
        case "Time":
        case "DateTime":
            str = "\\\"" + name + "\\\""
            break;
        default:
            if (scalars[scalar]){
                str = "\\\"" + name + "\\\""
            }
            break;
    }
    return str
}

export const getScalarFieldInfo = (currentType : Type , typesNameArray : string[]) => {
    let tableTemp: any[] = []
    currentType.fields.forEach(field => {
        let fieldType = field.type
        let fieldIsArray = field.isArray
        if (!typesNameArray.includes(fieldType) && field["in_model"] && isBasicType(fieldType)) {
            if (fieldType === "ID") {
                tableTemp.push({ field: "Pk_" + currentType.sqlTypeName + "_id", fieldType: "int", unique: false, constraint: "SERIAL PRIMARY KEY NOT NULL", isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues})
                field.sqlType = "int"
            }
            else if (fieldType === "String") {
                tableTemp.push({ field: field.name, fieldType: "text", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                field.sqlType = "text"
            }
            else if (fieldType === "Int") {
                tableTemp.push({ field: field.name, fieldType: "int", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                field.sqlType = "int"
            }
            else if (fieldType === "Boolean") {
                tableTemp.push({ field: field.name, fieldType: "boolean", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                field.sqlType = "boolean"
            }
            else if (fieldType === "Float") {
                tableTemp.push({ field: field.name, fieldType: "float8", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                field.sqlType = "float8"
            }
            else { // handle added  foreign_keys by other types ( detected as Int)
                let fkInfo = field.foreign_key
                tableTemp.push({ field: fkInfo.name, fieldType: fkInfo.type, noNull: fkInfo.noNull, unique: false, constraint: fkInfo.constraint, isArray: fkInfo.isArray, gqlType: fkInfo.type,  noNullArrayValues: field.nonNullArrayValues })
            }
        }

        else if (fieldType in scalars) {
            switch (fieldType) {
                case scalars.Date:
                    tableTemp.push({ field: field.name, fieldType: "date", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "date"
                    break
                case scalars.Time:
                    tableTemp.push({ field: field.name, fieldType: "time", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "time"
                    break
                case scalars.DateTime:
                    tableTemp.push({ field: field.name, fieldType: "timestamp", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "timestamp"
                    break
                case scalars.NonPositiveInt:
                case scalars.PositiveInt:
                case scalars.NonNegativeInt:
                case scalars.NegativeInt:
                case scalars.UnsignedInt:
                    tableTemp.push({ field: field.name, fieldType: "int", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "int"
                    break
                case scalars.NonPositiveFloat:
                case scalars.PositiveFloat:
                case scalars.NonNegativeFloat:
                case scalars.NegativeFloat:
                case scalars.UnsignedFloat:
                    tableTemp.push({ field: field.name, fieldType: "float8", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "float8"
                    break
                case scalars.BigInt:
                case scalars.Long:
                case scalars.Port:
                    tableTemp.push({ field: field.name, fieldType: "int8", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "int8"
                    break
                case scalars.GUID:
                    tableTemp.push({ field: field.name, fieldType: "uuid", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "uuid"
                    break
                case scalars.IPv4:
                case scalars.IPv6:
                    tableTemp.push({ field: field.name, fieldType: "inet", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "inet"
                    break
                case scalars.MAC:
                    tableTemp.push({ field: field.name, fieldType: "macaddr", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "macaddr"
                    break
                case scalars.USCurrency:
                case scalars.Currency:
                    tableTemp.push({ field: field.name, fieldType: "money", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "money"
                    break
                case scalars.JSON:
                case scalars.JSONObject:
                    tableTemp.push({ field: field.name, fieldType: "json", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "json"
                    break
                case scalars.Byte:
                    tableTemp.push({ field: field.name, fieldType: "bytea", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "bytea"
                    break
                case scalars.Linestring:
                case scalars.Point:
                case scalars.Polygon:
                    tableTemp.push({ field: field.name, fieldType: "geometry", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "geometry"
                    break
                case scalars.UtcOffset:
                case scalars.EmailAddress:
                case scalars.URL:
                case scalars.PhoneNumber:
                case scalars.PostalCode:
                case scalars.HexColorCode:
                case scalars.HSL:
                case scalars.HSLA:
                case scalars.RGB:
                    tableTemp.push({ field: field.name, fieldType: "int", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "int"
                    break
                /** Same as default **/
                // case scalars.RGBA:
                //     tableTemp.push({ field: field.name, fieldType: "text", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                //     field.sqlType = "text"
                //     break
                case scalars.ISBN:
                default:
                    // By default, scalar type other than the ones that have specific column type in postgres, it's up to the final user to modify the final field type in the table
                    tableTemp.push({ field: field.name, fieldType: "text", unique: false, constraint: null, isArray: fieldIsArray, gqlType: fieldType, noNull: field.noNull, noNullArrayValues: field.nonNullArrayValues })
                    field.sqlType = "text"
            }
        }
        else { // handle types who are traduced into foreignkeys
            if (field.foreign_key !== null  && field.in_model) {
                let fkInfo = field.foreign_key
                tableTemp.push({ field: fkInfo.name, fieldType: fkInfo.type, unique: false, constraint: fkInfo.constraint, isArray: fkInfo.isArray, gqlType: fkInfo.type,  noNullArrayValues: field.nonNullArrayValues })
                field.sqlType = fkInfo.type
            }
        }
    })

    return tableTemp

}