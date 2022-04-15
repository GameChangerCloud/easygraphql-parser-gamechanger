import {Type} from "../../lib";
import {expect} from "chai";
import * as path from "path";
import * as fs from "fs";

describe('Type & Field', function () {
    describe('Should convert json schema to types array', function () {
        const JSON_FOLDER = 'test/resources/schema-json'
        const TYPES_FOLDER = '../test/resources/schema-types'

        fs.readdirSync(JSON_FOLDER).forEach(file => {
            it('for file ' + file, function () {
                // GIVEN
                let schemaJSON = fs.readFileSync(
                    path.join(__dirname, "../../" + JSON_FOLDER, file),
                    'utf8'
                );

                // WHEN
                let types = Type.initTypes(JSON.parse(schemaJSON));

                // THEN
                let expectedTypes = JSON.parse(fs.readFileSync(
                    path.join(__dirname, "../" + TYPES_FOLDER, file.replace("-json.json", "-types.json")),
                    'utf8'
                ));
                expect(types)
                    .to.deep.equals(expectedTypes);
            });
        });
    });
});
