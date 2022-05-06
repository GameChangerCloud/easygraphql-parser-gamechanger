import {getDirectivesNames} from "../../lib";
import {expect} from "chai";


describe('get directives', function () {
    describe('getDirectivesNames', function () {
        it('should an array including all directives names', function () {
            //WHEN
            const resultString = getDirectivesNames()
            // THEN
            const expectedString = [ 'selector', 'warn' ]
            expect(resultString).to.be.deep.equals(expectedString)
        });
    })
});