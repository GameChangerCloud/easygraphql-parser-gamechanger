import {getEnumValues} from "../../lib";
import {expect} from "chai";


describe('directives methods', function () {
    describe('selector methods', function () {
        it('should return fields names table', function () {
            // GIVEN
            const currentType =   {
                "type": "EnumTypeDefinition",
                "fields": [],
                "values": [
                    "ROOKIE",
                    "ENSIGN",
                    "LIEUTENANT",
                    "COMMANDER",
                    "CAPTAIN"
                ],
                "types": [],
                "implementedTypes": [],
                "directives": []
            }
            //WHEN
            const resultString = getEnumValues(currentType)
            const expectedString = 'ROOKIE: {\n' +
                '\tvalue: 0\n' +
                '},ENSIGN: {\n' +
                '\tvalue: 1\n' +
                '},LIEUTENANT: {\n' +
                '\tvalue: 2\n' +
                '},COMMANDER: {\n' +
                '\tvalue: 3\n' +
                '},CAPTAIN: {\n' +
                '\tvalue: 4\n' +
                '},'
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
        it('should return a table with id String', function () {
            // GIVEN
            const currentType =   {
                "type": "EnumTypeDefinition",
                "fields": [],
                "values": [],
                "types": [],
                "implementedTypes": [],
                "directives": []
            }
            //WHEN
            const resultString = getEnumValues(currentType)

            const expectedString = ""
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
});