import {deprecatedDirective} from "../../lib";
import {expect} from "chai";

describe('deprecatedDirective method', () => {
    it("Given a directive's name, should return corresponding message", () => {
        //GIVEN
        let directiveName = "TestDirective";
        let expected = `directive @${directiveName}(reason: String) on FIELD_DEFINITION | ENUM_VALUE`

        //WHEN
        let result = deprecatedDirective(directiveName);

        //THEN
        expect(result.deprecatedDirectiveTypeDefs).to.be.equals(expected)
    })
})