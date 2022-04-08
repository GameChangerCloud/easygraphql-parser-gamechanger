import {formatName} from "../../lib";
import {expect} from "chai";

describe('formatName method', () => {
    it('Given weird name, should return formatted name with only letters', () => {
        //GIVEN
        let name = "name-123456789 _([|è`ç^à@]}+-*/&é'(App?./§!:;,"
        const expected = "nameApp"

        //WHEN
        name = formatName(name)

        //THEN
        expect(name).to.be.equals(expected)
    })
})