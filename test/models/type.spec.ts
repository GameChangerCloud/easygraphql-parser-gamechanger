import {schemaParser, Type} from "../../lib";
import {expect} from "chai";
import * as path from "path";
import * as fs from "fs";

describe('Type & Field', function () {
    describe('initType', function () {
        it('should return type array of types', function () {

            const JSON_FOLDER = 'test/resources/schema-json'
            const TYPES_FOLDER = '../test/resources/schema-types'
            let schemaJSON;
            let expectedTypes;
            let types;

            fs.readdirSync(JSON_FOLDER).forEach(file => {
                // GIVEN
                schemaJSON = fs.readFileSync(
                    path.join(__dirname, "../../" + JSON_FOLDER, file),
                    'utf8'
                );

                // WHEN
                types = Type.initTypes(JSON.parse(schemaJSON));

                // THEN
                expectedTypes = fs.readFileSync(
                    path.join(__dirname, "../" + TYPES_FOLDER, file.replace("-json.json", "-types.json")),
                    'utf8'
                );
                expect(types).to.exist
                expect(types).to.deep.equals(JSON.parse(expectedTypes));
            });
        });
    });
});
