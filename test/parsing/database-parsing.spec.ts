import * as fs from "fs";
import * as path from "path";
import {
    getAllTables,
    getInitEachFieldsModelsJS,
    getInitEachModelsJS,
    getRelations,
    schemaParser,
    Type
} from "../../lib";
import {expect} from "chai";

describe('database-parsing methods', function () {

    const generateTypeWithRelations = (schema): Type[] => {
        let types = Type.initTypes(schemaParser(schema))
        let entityTypes = types.filter(type => type.type === "ObjectTypeDefinition")
        return getRelations(entityTypes)
    }

    describe('getAllTables method', function () {
        it('should return json table', function () {
            // GIVEN
            const RELATIONS_FOLDER = '../resources/parsing/get-all-tables'
            let schema = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, "get-all-tables-test.graphql"),
                'utf8'
            );

            let types = generateTypeWithRelations(schema);

            const tables = getAllTables(types)

            // THEN
            let expectedTypes = fs.readFileSync(
                path.join(__dirname, RELATIONS_FOLDER, "get-all-tables-test.json"),
                'utf8'
            );
            expect(tables).to.exist
            expect(tables).to.deep.equals(JSON.parse(expectedTypes));
        });
    })

    describe('getInitEachModelJS method', () => {
        it('Given tables, should return init models', () => {
            //GIVEN
            let tables = [{
                name: "Movie",
                sqlname: "movie",
                columns: [],
                isJoinTable: false
            }, {
                name: "Actor",
                sqlname: "actor",
                columns: [],
                isJoinTable: false
            }]
            //WHEN
            let result = getInitEachModelsJS(tables)
            //THEN
            expect(result).to.be.equals('init' + tables[0].name + '()\ninit' + tables[1].name + '()\n')
        })

        it('Given nothing in tables, should return "" string', () => {
            //GIVEN
            let tables = []
            //WHEN & THEN
            expect(getInitEachModelsJS(tables)).to.be.equals('')
        })
    })

    describe('getInitEachFieldsModelsJS method', () => {
        it('should return initField methods', () => {
            //GIVEN
            let schema = fs.readFileSync(
                path.join(__dirname, "../resources/schema-graphql", "movies-simple.graphql"),
                'utf8'
            );

            let types = generateTypeWithRelations(schema);
            let s = ''
            types.forEach(type => {
                if (type.typeName !== "Query" && type.typeName !== "Mutation" && type.typeName !== "Subscription") {
                    s += 'for(let i = 0; i < ' + type.typeName.toLowerCase() + 'Tab.length; i++){\n\t' + type.typeName.toLowerCase() + 'Tab[i] = update' + type.typeName + '(' + type.typeName.toLowerCase() + 'Tab[i], i);\n}'
                }
            })
            let expected = s + '\n\n'


            //WHEN
            let result = getInitEachFieldsModelsJS(types)

            //THEN
            expect(result).to.be.equals(expected)
        })
    })
});