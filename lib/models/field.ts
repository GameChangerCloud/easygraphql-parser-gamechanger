import {Relationships} from "../constants/relationships";
import {Scalars} from "../constants/scalar";
import {SQLTypeNotSupported} from "../parsing/error/sql-type-not-supported";

export interface IField {
    name: string;
    type: string;
    relationType: Relationships;
    relation: boolean;
    in_model: boolean;
    oneToOneInfo: any;
    noNullArrayValues: boolean;
    noNull: boolean;
    isArray: boolean;
    directives: any;
    arguments: any;
    delegated_field: any;
    foreign_key: any;
    isDeprecated: boolean;
    joinTable: any;
    sqlType: string;
}

export class Field {
    name: string;
    type: string;
    relationType: Relationships;
    relation: boolean;
    in_model: boolean;
    oneToOneInfo: any;
    noNullArrayValues: boolean;
    noNull: boolean;
    isArray: boolean;
    directives: any;
    arguments: any;
    delegated_field: any;
    foreign_key: any;
    isDeprecated: boolean;
    joinTable: any;
    sqlType: string;
    activeSide?: boolean

    constructor(
        name: string,
        type: string,
        noNullArrayValues: boolean,
        noNull: boolean,
        isArray: boolean,
        directives: any,
        args: any,
        isDeprecated: boolean,
    ) {
        this.name = name
        this.type = type
        this.noNullArrayValues = noNullArrayValues
        this.noNull = noNull
        this.isArray = isArray
        this.directives = directives
        this.arguments = args
        this.isDeprecated = isDeprecated
    }

    setNoNull() {
        this.noNull = true
    }

    /**
     * Set up types fields to handle tracking of foreign key that might have been added by other types
     * Init Object type parameters . obj = {key1 : value1, key2 : value2 ....}
     * @returns nothing
     */
    initObjectParameters() {
        this.foreign_key = null;
        // if the field is a relation
        this.relation = false;
        // if the field is added or is adding to another field
        this.delegated_field = {
            "state": false,
            "side": null,
            "associatedWith": {
                "type": null,
                "fieldName": null
            }
        }
        // if the field will appear in final model (tables) ex for oneToMany relation the field may dissapear
        this.in_model = true;

        // contains info if the field will be in a joinTable in final model, the name of the table
        // the name of the fields associated in the table
        this.joinTable = {
            "state": false,
            "name": null,
            "contains": []
        }
        //Contains info about OneToOne relations
        this.oneToOneInfo = null

        // adds info about the field sqlType
        this.sqlType = getSQLType(this.type)
    }
}

const getSQLType = (fieldType: string) => {
    switch (fieldType) {
        case "ID":
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
            return "int"
        case "String":
        case Scalars.ISBN:
        case Scalars.RGBA:
            return "text"
        case "Int":
            return "int"
        case "Boolean":
            return "boolean"
        case "Float":
        case Scalars.NonPositiveFloat:
        case Scalars.PositiveFloat:
        case Scalars.NonNegativeFloat:
        case Scalars.NegativeFloat:
        case Scalars.UnsignedFloat:
            return "float8"
        case Scalars.Date:
            return "date"
        case Scalars.Time:
            return "time"
        case Scalars.DateTime:
            return "timestamp"
        case Scalars.BigInt:
        case Scalars.Long:
        case Scalars.Port:
            return "int8"
        case Scalars.GUID:
            return "uuid"
        case Scalars.IPv4:
        case Scalars.IPv6:
            return "inet"
        case Scalars.MAC:
            return "macaddr"
        case Scalars.USCurrency:
        case Scalars.Currency:
            return "money"
        case Scalars.JSON:
        case Scalars.JSONObject:
            return "json"
        case Scalars.Byte:
            return "bytea"
        case Scalars.LineString:
        case Scalars.Point:
        case Scalars.Polygon:
            return "geometry"
        default:
            throw new SQLTypeNotSupported(fieldType)
    }
}