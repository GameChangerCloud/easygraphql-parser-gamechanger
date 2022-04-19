import {Scalars} from '../constants/scalar';
import {getSQLTableName} from "../utils/get-sql-table-name";

export const isScalar = (typeName: string) => {
    return typeName in Scalars || isBasicType(typeName)
}

export const isBasicType = (typeName: string) => {
    let defaultScalars = ['String', 'ID', 'Int', 'Boolean', 'Float']
    return defaultScalars.includes(typeName)
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
            if (Scalars[type]) {
                console.log(type)
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
            str = "\\\"Pk_" + getSQLTableName(type) + "_id\\\""
            break;
        case "Boolean":
        case "Int":
        case "String":
            str = "\\\"" + name + "\\\""
            break;
        default:
            if (Scalars[scalar]){
                str = "\\\"" + name + "\\\""
            }
            break;
    }
    return str
}

