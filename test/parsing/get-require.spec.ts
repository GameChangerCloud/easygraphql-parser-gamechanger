import {getRequire, Scalars} from "../../lib";
import util from 'util'
import {expect} from "chai";
import fs from "fs";
import path from "path";


describe('get require methods', function () {
    describe('getRequire', function () {
        it('should return fields names table', function () {
            // GIVEN
            const currentType = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../resources/parsing/get-require/type.json'),
                'utf8'
            ));
            //WHEN
            const resultString = getRequire(currentType,Object.values(Scalars))
            const expectedString = "const StudioType = require('./studio')\n"
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
        it('should return empty string', function () {
            // GIVEN
            const currentType = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../resources/parsing/get-require/type-without-relations.json'),
                'utf8'
            ));
            //WHEN
            const resultString = getRequire(currentType,Object.values(Scalars))
            const expectedString = ""
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
});
