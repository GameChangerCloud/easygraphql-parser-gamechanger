import {getGraphqlType, Type, typesGenerator} from "../../lib";
import {expect} from "chai";
import {IType} from "../../lib/models/type";
import {NotUsedTypeError} from "../../lib/parsing/error/not-used-type.error";

describe('Should return the corresponding graphQL type', function () {
    function buildType(type: string): Type {
        return new Type(
            type,
            "Test",
            "test",
            "",
            [],
            []
        );
    }

    it('should return GraphQLEnumType', function () {
        // GIVEN
        const type = buildType("EnumTypeDefinition");

        // WHEN
        const graphqlType = getGraphqlType(type);

        // THEN
        expect(graphqlType).to.be.equals("GraphQLEnumType");
    });
    it('should return GraphQLInterfaceType', function () {
        // GIVEN
        const type = buildType("InterfaceTypeDefinition");

        // WHEN
        const graphqlType = getGraphqlType(type);

        // THEN
        expect(graphqlType).to.be.equals("GraphQLInterfaceType");
    });
    it('should return GraphQLObjectType', function () {
        // GIVEN
        const type = buildType("ObjectTypeDefinition");

        // WHEN
        const graphqlType = getGraphqlType(type);

        // THEN
        expect(graphqlType).to.be.equals("GraphQLObjectType");
    });
    it('should return GraphQLScalarType', function () {
        // GIVEN
        const type = buildType("ScalarTypeDefinition");

        // WHEN
        const graphqlType = getGraphqlType(type);

        // THEN
        expect(graphqlType).to.be.equals("GraphQLScalarType");
    });

    it('should throw NotUsedTypeError', function () {
        // GIVEN
        const type = buildType("");
        // THEN
        expect(() => getGraphqlType(type))
            .to.throw(NotUsedTypeError)
    });

});

