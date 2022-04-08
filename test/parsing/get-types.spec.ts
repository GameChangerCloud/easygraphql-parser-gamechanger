import path from "path";
import fs from "fs";
import {expect} from "chai";
import {getAllTypesName, getTypesExceptQueries} from "../../lib";

describe('get types', function () {
    describe('getAllTypesName', function () {
        it('should return an array including all types names', function () {
            // GIVEN
            const schema = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../resources/parsing/get-types/schema.json'),
                'utf8'
            ));
            //WHEN
            const resultArray = getAllTypesName(schema)
            const expectedArray = ['Tweet', 'DateTime', 'User', 'Stat', 'Notification', 'Meta']
            // THEN
            expect(resultArray).to.exist
            expect(resultArray).to.be.deep.equals(expectedArray)
        });
        it('should an empty array', function () {
            // GIVEN
            const schema = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../resources/parsing/get-types/schema-without-types.json'),
                'utf8'
            ));
            //WHEN
            const resultArray = getAllTypesName(schema)
            const expectedArray = []
            // THEN
            expect(resultArray).to.exist
            expect(resultArray).to.be.deep.equals(expectedArray)
        });
    })
    describe('getTypesExceptQueries', function () {
        it('should return all types without queries and mutations', function () {

            const RESOURCE_FOLDER = 'test/resources/parsing/get-types/schemas-json'
            const ALLTYPES_FOLDER = '../../test/resources/parsing/get-types/schemas-all-types-except-queries-and-mutations'

            let schemaJSON;
            let resultTypes;
            let expectedTypes;


            fs.readdirSync(RESOURCE_FOLDER).forEach(file => {
                // GIVEN
                schemaJSON = fs.readFileSync(
                    path.join(__dirname, "../../" + RESOURCE_FOLDER, file),
                    'utf8'
                );

                // WHEN
                resultTypes = getTypesExceptQueries(JSON.parse(schemaJSON));

                // THEN
                expectedTypes = fs.readFileSync(
                    path.join(__dirname, ALLTYPES_FOLDER, file.replace(".json", "-all-types-without-queries-and-mutations.json")),
                    'utf8'
                );
                expect(resultTypes).to.exist
                expect(resultTypes).to.deep.equals(JSON.parse(expectedTypes));
            });
        });
        it('should return an empty type', function () {
            // GIVEN
            let schemaJSON;
            let resultTypes;
            let expectedTypes;

            schemaJSON = JSON.parse(fs.readFileSync(
                path.join(__dirname, "../resources/parsing/get-types/schema-without-types.json"),
                'utf8'
            ));

            // WHEN
            resultTypes = getTypesExceptQueries(schemaJSON);
            expectedTypes = []
            // THEN
            expect(resultTypes).to.exist
            expect(resultTypes).to.deep.equals(expectedTypes)
        });
    })
});