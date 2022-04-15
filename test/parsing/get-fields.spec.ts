import {getFields, getFieldsDirectiveNames} from "../../lib";

import * as path from "path";
import * as fs from "fs";
import {expect} from "chai";


describe('get field methods', function () {
    const type = JSON.parse(fs.readFileSync(
        path.join(__dirname, '../resources/parsing/get-fields/type.json'),
        'utf8'
    ));
    describe('getFields', function () {
        it('should return all fields of the type', function () {
            // GIVEN
            const typeList = getFields(type)
            //WHEN
            // THEN
            expect(typeList).to.be.deep.equals(type.fields)
        });
    })
    describe('getFieldsDirectiveNames', function () {
        it('should return an array with all directives names of the type', function () {
            // GIVEN
            const directivesArray = getFieldsDirectiveNames(type)
            //WHEN
            const expectedDirectivesArray = [ 'auth', 'length', 'format', 'valueReducer', 'deprecated' ]
            // THEN
            expect(directivesArray).to.be.deep.equals(expectedDirectivesArray)
        });
    })
});