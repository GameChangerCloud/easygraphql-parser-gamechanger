"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGraphqlType = void 0;
const getGraphqlType = (type) => {
    switch (type.type) {
        case "EnumTypeDefinition":
            return "GraphQLEnumType";
        case "InterfaceTypeDefinition":
            return "GraphQLInterfaceType";
        case "ObjectTypeDefinition":
            return "GraphQLObjectType";
        case "ScalarTypeDefinition":
            return "GraphQLScalarType";
    }
};
exports.getGraphqlType = getGraphqlType;
