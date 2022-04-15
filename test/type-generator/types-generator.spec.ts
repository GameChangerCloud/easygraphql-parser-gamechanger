import fs from "fs";
import path from "path";
import {schemaParser, typesGenerator} from "../../lib";
import {expect} from "chai";
let RESOURCE_FOLDER = '../resources/types-generator'
const read = (filePath: string) => fs.readFileSync(
        path.join(__dirname, RESOURCE_FOLDER, filePath),
        'utf8')

describe('TypesGenerator method', () => {

    it('Given a valid schema, should return corresponding types array', () => {
        //GIVEN
        let graphQLSchema = read('id.graphql');
        let expected = JSON.parse(read('schema.json'));

        //WHEN
        let types = typesGenerator(schemaParser(graphQLSchema));

        //THEN
        expect(types).to.be.deep.equals(expected)
    })

    it('Given a schema with types without id, should return types array with id field created', () => {
        //GIVEN
        let graphQLSchema = read('no-id.graphql');
        let expected = JSON.parse(read('schema.json'));

        //WHEN
        let types = typesGenerator(schemaParser(graphQLSchema));

        //THEN
        expect(types).to.be.deep.equals(expected)
    })

    it('Given a schema undefined field(s), should throw an error', () => {
        //GIVEN
        let graphQLSchema = read('undefined-fields.graphql');
        // WHEN & THEN
        let schemaJSON = schemaParser(graphQLSchema);
        expect(() => typesGenerator(schemaJSON))
            .to.throw()
    })
})