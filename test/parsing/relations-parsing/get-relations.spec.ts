import fs from "fs";
import path from "path";
import {getRelations, isScalar, schemaParser, Type} from "../../../lib";
import {expect} from "chai";
import {OneToOneRelationNotAllowedError} from "../../../lib/parsing/error/one-to-one-not-allowed";

describe('getRelations methods', () => {
    let schema;
    let types: Type[];
    let expectedTypes: Type[];

    const RELATIONS_FOLDER = '../../resources/parsing/get-relations-schema'
    const generateTypes = (schema) => Type.initTypes(schemaParser(schema));
    const readFile = (folder: string, filePath: string) => fs.readFileSync(
        path.join(__dirname, RELATIONS_FOLDER, folder, filePath),
        'utf8'
    );
    const getProcessedTypeWithProcessedFields = (types: Type[]) => {
        types.filter(type => type.type === "ObjectTypeDefinition" && type.isNotOperation())
            .forEach(type => type.fields = type.fields.filter(field => !isScalar(field.type) || field.name.includes('Fk_')))
    }

    it('should return type with OneOnly relation', function () {
        schema = readFile('one-only', 'one-only.graphql');
        types = generateTypes(schema);

        types = getRelations(types);

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('one-only', 'one-only-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    describe('OneToOne relations', () => {
        it('should return type with OneToOne relation', function () {
            schema = readFile('one-to-one', 'one-to-one.graphql');
            types = generateTypes(schema);

            types = getRelations(types);

            // For our tests we only need to focus on the entities in our types and their relational fields
            getProcessedTypeWithProcessedFields(types)
            expectedTypes = JSON.parse(readFile('one-to-one', 'one-to-one-expected.json'));

            expect(types).to.deep.equals(expectedTypes)
        });

        it('should throw an OneToOneRelationNotAllowed error given bidirectional OneToOne relation', function () {
            schema = readFile('one-to-one', 'bidirectional-one-to-one.graphql');
            types = generateTypes(schema);

            expect(() => getRelations(types)).to.throw(OneToOneRelationNotAllowedError);
        });
    })

    it('should return types with oneToMany relation', function () {
        schema = readFile('one-to-many', 'one-to-many.graphql');
        types = generateTypes(schema)

        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('one-to-many', 'one-to-many-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    it('should return types with selfJoinOne relation', function () {
        schema = readFile('self-join-one', 'self-join-one.graphql');
        types = generateTypes(schema)

        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('self-join-one', 'self-join-one-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    it('should return types with manyOnly relation', function () {
        schema = readFile('many-only', 'many-only.graphql');
        types = generateTypes(schema)
        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('many-only', 'many-only-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    it('should return types with manyToOne relation', function () {
        schema = readFile('many-to-one', 'many-to-one.graphql');
        types = generateTypes(schema)
        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('many-to-one', 'many-to-one-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    it('should return types with manyToMany relation', function () {
        schema = readFile('many-to-many', 'many-to-many.graphql');
        types = generateTypes(schema)
        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('many-to-many', 'many-to-many-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });

    it('should return types with selfJoinMany relation', function () {
        schema = readFile('self-join-many', 'self-join-many.graphql');
        types = generateTypes(schema)
        types = getRelations(types)

        // For our tests we only need to focus on the entities in our types and their relational fields
        getProcessedTypeWithProcessedFields(types)
        expectedTypes = JSON.parse(readFile('self-join-many', 'self-join-many-expected.json'));

        expect(types).to.deep.equals(expectedTypes)
    });
})
