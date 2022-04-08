import {IType, Type} from "../../../lib/models/type";
import fs from "fs";
import path from "path";
import {getFieldsParsed, Scalars, schemaParser} from "../../../lib";
import {expect} from "chai";
import util from "util";

describe('GetFieldsParsed Method', () => {
    const FIELD_PARSING_FOLDER = '../../resources/parsing/fields-parsing/get-fields-parsed'

    const getTypes = (file: string): IType[] => {
        let schema = fs.readFileSync(
            path.join(__dirname, FIELD_PARSING_FOLDER, file),
            'utf8'
        );
        return Type.initTypes(schemaParser(schema))
    }

    describe('Given type with ID field, should return right message', () => {
        let types = getTypes('id.graphql')

        it('Type is Entity', () => {
            //GIVEN
            let type = types[0]
            let IDField = type.fields[0]
            let expected = `${IDField.name}: { type: new GraphQLNonNull(GraphQLID) },\n`

            //WHEN
            let result = getFieldsParsed(type, [], [], [])

            //THEN
            expect(result).to.be.equals(expected)
        })
        it('Type is Mutation/Query/Subscription', () => {
            //GIVEN
            let mutationType = types[1]
            let queryType = types[2]
            let mutationIDField = mutationType.fields[0]
            let queryIDField = queryType.fields[0]
            let mutationExpected =
                `${mutationIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLID),\n`
                + `\t\t\targs: {\n`
                + `\t\t\t\t${mutationIDField.name}: { type: new GraphQLNonNull(GraphQLID) },\n`
                + `\t\t\t},\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            let queryExpected =
                `${queryIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLID),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let mutationResult = getFieldsParsed(mutationType, [], [], [])
            let queryResult = getFieldsParsed(queryType, [], [], [])

            //THEN
            expect(mutationResult).to.be.equals(mutationExpected)
            expect(queryResult).to.be.equals(queryExpected)
        })
    })

    describe('Given type with String field, should return right message', () => {
        let types = getTypes('string.graphql')

        it('Type is Entity', () => {
            //GIVEN
            let type = types[0]
            let IDField = type.fields[0]
            let expected = `${IDField.name}: { type: new GraphQLNonNull(GraphQLString) },\n`

            //WHEN
            let result = getFieldsParsed(type, [], [], [])

            //THEN
            expect(result).to.be.equals(expected)
        })
        it('Type is Mutation/Query/Subscription', () => {
            //GIVEN
            let mutationType = types[1]
            let queryType = types[2]
            let mutationIDField = mutationType.fields[0]
            let queryIDField = queryType.fields[0]
            let mutationExpected =
                `${mutationIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLString),\n`
                + `\t\t\targs: {\n`
                + `\t\t\t\t${mutationIDField.name}: { type: new GraphQLNonNull(GraphQLString) },\n`
                + `\t\t\t},\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            let queryExpected =
                `${queryIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLString),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let mutationResult = getFieldsParsed(mutationType, [], [], [])
            let queryResult = getFieldsParsed(queryType, [], [], [])

            //THEN
            expect(mutationResult).to.be.equals(mutationExpected)
            expect(queryResult).to.be.equals(queryExpected)
        })
    })

    describe('Given type with Int field, should return right message', () => {
        let types = getTypes('int.graphql')

        it('Type is Entity', () => {
            //GIVEN
            let type = types[0]
            let IDField = type.fields[0]
            let expected = `${IDField.name}: { type: new GraphQLNonNull(GraphQLInt) },\n`

            //WHEN
            let result = getFieldsParsed(type, [], [], [])

            //THEN
            expect(result).to.be.equals(expected)
        })
        it('Type is Mutation/Query/Subscription', () => {
            //GIVEN
            let mutationType = types[1]
            let queryType = types[2]
            let mutationIDField = mutationType.fields[0]
            let queryIDField = queryType.fields[0]
            let mutationExpected =
                `${mutationIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLInt),\n`
                + `\t\t\targs: {\n`
                + `\t\t\t\t${mutationIDField.name}: { type: new GraphQLNonNull(GraphQLInt) },\n`
                + `\t\t\t},\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            let queryExpected =
                `${queryIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLInt),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let mutationResult = getFieldsParsed(mutationType, [], [], [])
            let queryResult = getFieldsParsed(queryType, [], [], [])

            //THEN
            expect(mutationResult).to.be.equals(mutationExpected)
            expect(queryResult).to.be.equals(queryExpected)
        })
    })

    describe('Given type with Boolean field, should return right message', () => {
        let types = getTypes('boolean.graphql')

        it('Type is Entity', () => {
            //GIVEN
            let type = types[0]
            let IDField = type.fields[0]
            let expected = `${IDField.name}: { type: new GraphQLNonNull(GraphQLBoolean) },\n`

            //WHEN
            let result = getFieldsParsed(type, [], [], [])

            //THEN
            expect(result).to.be.equals(expected)
        })
        it('Type is Mutation/Query/Subscription', () => {
            //GIVEN
            let mutationType = types[1]
            let queryType = types[2]
            let mutationIDField = mutationType.fields[0]
            let queryIDField = queryType.fields[0]
            let mutationExpected =
                `${mutationIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLBoolean),\n`
                + `\t\t\targs: {\n`
                + `\t\t\t\t${mutationIDField.name}: { type: new GraphQLNonNull(BooleanType) },\n`
                + `\t\t\t},\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            let queryExpected =
                `${queryIDField.name}: { \n`
                + `\t\t\ttype: new GraphQLNonNull(GraphQLBoolean),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let mutationResult = getFieldsParsed(mutationType, [], [], [])
            let queryResult = getFieldsParsed(queryType, [], [], [])

            //THEN
            expect(mutationResult).to.be.equals(mutationExpected)
            expect(queryResult).to.be.equals(queryExpected)
        })
    })

    describe('Given type with non default field, should return right message', () => {
        let scalars = Object.values(Scalars);

        it('Type is Query', () => {
            //GIVEN
            let types = getTypes('query.graphql')
            let typesNameArray = types.map(type => type.typeName)
            let type = types[1]
            let expected = `getNames: { \n`
                + `\t\t\ttype: new GraphQLList(GraphQLString),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
                + `\t\tgetColor: { \n`
                + `\t\t\ttype: RGB,\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
                + `\t\tperson: { \n`
                + `\t\t\ttype: PersonType,\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let result = getFieldsParsed(type, [], typesNameArray, scalars)

            //THEN
            expect(result).to.be.equals(expected)
        })

        it('Type is Mutation', () => {
            //GIVEN
            let types = getTypes('mutation.graphql')
            let typesNameArray = types.map(type => type.typeName)
            let type = types[1]
            let expected = `getNames: { \n`
                + `\t\t\ttype: new GraphQLList(GraphQLString),\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
                + `\t\tgetColor: { \n`
                + `\t\t\ttype: RGB,\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
                + `\t\tperson: { \n`
                + `\t\t\ttype: PersonType,\n`
                + `\t\t\tresolve: (obj, args, context, info) => {\n`
                + `\t\t\t\t // To define \n`
                + `\t\t\t}\n`
                + `\t\t},\n`
            //WHEN
            let result = getFieldsParsed(type, [], typesNameArray, scalars)

            //THEN
            expect(result).to.be.equals(expected)
        })

        it('Type is Entity', () => {
            //GIVEN
            let types = getTypes('entity.graphql')
            let typesNameArray = types.map(type => type.typeName)
            let type = types[2]
            let interfaceType = types[1]
            let expected = `hairColor: { \n`
                + `\t\t\ttype: RGB,\n`
                + `\n`
                + `\t\t},\n`
                + `\t\tfriend: { \n`
                + `\t\t\ttype: PersonType,\n`
                + `\n`
                + `\t\t},\n`
            let expectedInterface = `hairColor: { \n`
                + `\t\t\ttype: RGB,\n`
                + `\n`
                + `\t\t},\n`
                + `\t\t\t\t\tresolve: (obj, args, context) => {\n\t\t\t\treturn resolveType(args)\n\t\t\t}`
                + `\n\t\t},\n`
            //WHEN
            let result = getFieldsParsed(type, [], typesNameArray, scalars)
            let interfaceResult = getFieldsParsed(interfaceType, [], typesNameArray, scalars)
            //THEN
            expect(result).to.be.equals(expected)
            expect(interfaceResult).to.be.equals(expectedInterface)
        })

    })

})