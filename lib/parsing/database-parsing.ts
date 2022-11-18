import {Type} from "../models/type";
import {Scalars} from "../constants/scalar";
import {isBasicScalar} from "../scalar-managment/manage-scalars";
import {Field} from "../models/field";
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
            tableTemp.push(...getScalarFieldInfo(currentType, typesNameArray))

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

const pushBasicScalarFieldInfo = (currentType: Type, field: Field, tableTemp: any[]) => {
    switch (field.type) {
        case "ID":
            tableTemp.push({
                field: "Pk_" + currentType.sqlTypeName + "_id",
                fieldType: "int",
                unique: false,
                constraint: "SERIAL PRIMARY KEY NOT NULL",
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "int"
            break;
        case "String":
            tableTemp.push({
                field: field.name,
                fieldType: "text",
                unique: false,
                constraint: null,
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "text"
            break;
        case "Int":
            tableTemp.push({
                field: field.name,
                fieldType: "int",
                unique: false,
                constraint: null,
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "int"
            break;
        case "Boolean":
            tableTemp.push({
                field: field.name,
                fieldType: "boolean",
                unique: false,
                constraint: null,
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "boolean"
            break;
        case "Float":
            tableTemp.push({
                field: field.name,
                fieldType: "float8",
                unique: false,
                constraint: null,
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "float8"
            break;
        default:
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
            break;
    }
}

function pushCustomScalarFieldInfo(currentType: Type, field: Field, tableTemp: any[]) {
    switch (field.type) {
        case Scalars.Date:
            tableTemp.push({
                field: field.name,
                fieldType: "date",
                unique: false,
                constraint: null,
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
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
                isArray: field.isArray,
                gqlType: field.type,
                noNull: field.noNull,
                noNullArrayValues: field.noNullArrayValues
            })
            field.sqlType = "text"
            break
    }

}

const getScalarFieldInfo = (currentType: Type, typesNameArray: string[]) => {
    let tableTemp: any[] = []
    currentType.fields.forEach(currentField => {
        if (!typesNameArray.includes(currentField.type) && currentField["in_model"] && isBasicScalar(currentField.type)) {
            pushBasicScalarFieldInfo(currentType, currentField, tableTemp)
        } else if (currentField.type in Scalars) {
            pushCustomScalarFieldInfo(currentType, currentField, tableTemp)
        } else { // handle types who are traduced into foreignKeys
            if (currentField.foreign_key !== null && currentField.in_model) {
                let fkInfo = currentField.foreign_key
                tableTemp.push({
                    field: fkInfo.name,
                    fieldType: fkInfo.type,
                    unique: false,
                    constraint: currentField.type === "ID" ? "SERIAL PRIMARY KEY" : null,
                    isArray: currentField.isArray,
                    gqlType: currentField.type,
                    noNull: currentField.noNull,
                    noNullArrayValues: currentField.noNullArrayValues
                })
            }
        }
    })
    return tableTemp;
}