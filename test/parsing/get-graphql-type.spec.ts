import {getGraphqlType} from "../../lib";
import {expect} from "chai";
import {IType} from "../../lib/models/type";

describe('getGraphqlType', function () {
    describe('should return the corresponding graphQL type', function () {
        it('should return graphql types', function () {
            // GIVEN
            const types = ["EnumTypeDefinition","InterfaceTypeDefinition","ObjectTypeDefinition","ScalarTypeDefinition"];
            const expectations = ["GraphQLEnumType","GraphQLInterfaceType","GraphQLObjectType","GraphQLScalarType"];
            let type: IType;
            for (let index = 0; index < types.length; index++) {
                type = {
                    "type": types[index],
                    "typeName": "Test",
                    "sqlTypeName": "test",
                    "description": "",
                    "directives": [],
                    "fields": [],
                    "implementedTypes": [],
                    "relationList": []
                };

                // WHEN
                const graphqlType = getGraphqlType(type)

                // THEN
                expect(graphqlType).to.exist
                expect(graphqlType).to.be.equals(expectations[index]);
            }
        });

    })

    describe('type is not known', function (){
        it('should return undefined', () => {
            const type: IType = {
                "type": "TestType",
                "typeName": "Test",
                "sqlTypeName": "test",
                "description": "",
                "directives": [],
                "fields": [],
                "implementedTypes": [],
                "relationList": []
            };
            const graphqlType = getGraphqlType(type)
            expect(graphqlType).to.not.exist
            expect(graphqlType).to.be.equals(undefined);
        });
    })
});

