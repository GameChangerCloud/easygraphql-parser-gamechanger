import {findField} from "../../lib";
import {expect} from "chai";
import fs from "fs";
import path from "path";

describe("getField method", () => {

    let types;

    before(() => {
        types = JSON.parse(fs.readFileSync(
            path.join(__dirname, '../resources/schema-types/', 'movies-simple-types.json'),
            'utf8'
        ));
    })

    it("Given a title, should return the right field", () => {
        //GIVEN
        let fields = types[0].fields;

        //WHEN
        let fieldFounded = findField(fields, "title")

        //THEN
        expect(fieldFounded).to.be.deep.equals(fields[1])
    })

    it("Given a name, should return undefined", () => {
        //GIVEN
        let fields = types[0].fields;

        //WHEN
        let fieldFounded = findField(fields, "name")

        //THEN
        expect(fieldFounded).to.be.undefined
    })
})