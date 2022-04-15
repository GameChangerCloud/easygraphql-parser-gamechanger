import {getDirectivesNames} from "../../lib";
import {expect} from "chai";


describe('get directives', function () {
    describe('getDirectivesNames', function () {
        it('should an array including all directives names', function () {
            // GIVEN

            //WHEN
            const resultString = getDirectivesNames()
            const expectedString = [ 'selector', 'warn' ]
            // THEN
            expect(resultString).to.be.deep.equals(expectedString)
        });
    })
});