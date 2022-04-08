import fs from "fs";
import path from "path";
import {isSchemaValid} from '../../lib'
import {expect} from "chai";

describe('isSchemaValid', () => {

    const IS_VALID_FOLDER = '../../test/resources/utils/is-schema-valid'

    describe('Valid Schema', () => {
        it('should return response true', () => {
            // GIVEN
            let types = fs.readFileSync(
                path.join(__dirname, IS_VALID_FOLDER, "valid-astronauts-types.json"),
                'utf8'
            );

            //WHEN
            let isValid = isSchemaValid(JSON.parse(types))

            // THEN
            expect(isValid.response).to.be.true
        })
    });

    describe('Invalid Schema', () => {
        it('should return response false and no ID type message', () => {
            // GIVEN
            let types = fs.readFileSync(
                path.join(__dirname, IS_VALID_FOLDER, "invalid-astronauts-no-id-types.json"),
                'utf8'
            );

            // WHEN
            let isValid = isSchemaValid(JSON.parse(types));

            // THEN
            expect(isValid.response).to.be.false

            expect(isValid.reason).to.be.equals("Missing required id field of type ID in one or multiple Entity")
        })

        it('should return response false and unknown field type message', () => {
            // GIVEN
            let types = fs.readFileSync(
                path.join(__dirname, IS_VALID_FOLDER, "invalid-astronauts-no-exist-types.json"),
                'utf8'
            );

            // WHEN
            let isValid = isSchemaValid(JSON.parse(types));

            // THEN
            expect(isValid.response).to.be.false
            expect(isValid.reason).to.be.equals("One Entity has one or multiple fields of undefined types. Please use default scalar, declare your own scalar or declare missing entity type")
        })
    })
});





