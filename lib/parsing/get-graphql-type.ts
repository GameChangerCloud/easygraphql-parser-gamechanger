import {IType} from "../models/type";

export const getGraphqlType = (type: IType) => {
    switch (type.type) {
        case "EnumTypeDefinition":
            return "GraphQLEnumType"
        case "InterfaceTypeDefinition":
            return "GraphQLInterfaceType"
        case "ObjectTypeDefinition":
            return "GraphQLObjectType"
        case "ScalarTypeDefinition":
            return "GraphQLScalarType"
    }
}