import {IType} from "../models/type";
import {NotUsedTypeError} from "./error/not-used-type.error";

type GraphQLStringType = "GraphQLEnumType" | "GraphQLInterfaceType" | "GraphQLObjectType" | "GraphQLScalarType";

export function getGraphqlType(type: IType): GraphQLStringType {
    switch (type.type) {
        case "EnumTypeDefinition":
            return "GraphQLEnumType"
        case "InterfaceTypeDefinition":
            return "GraphQLInterfaceType"
        case "ObjectTypeDefinition":
            return "GraphQLObjectType"
        case "ScalarTypeDefinition":
            return "GraphQLScalarType"
        default:
            throw new NotUsedTypeError(type.type);
    }
}