import {findField, findTable} from "../../lib";
import {expect} from "chai";
import fs from "fs";
import path from "path";

describe("getField method", () => {

    const tables = [
        {
            name: 'Astronauts',
            sqlname: 'astronauts',
            columns: [],
            isJoinTable: false
        },{
            name: 'Rocket',
            sqlname: 'rocket',
            columns: [],
            isJoinTable: false
        },
    ]

    it("Given a right name, should return the right table", () => {
        //GIVEN Tables constant

        //WHEN
        let tableFounded = findTable(tables, "Astronauts")

        //THEN
        expect(tableFounded).to.be.deep.equals(tables[0])
    })

    it("Given a wrong name, should return undefined", () => {
        //GIVEN Tables constant

        //WHEN
        let tableFounded = findTable(tables, "Movie")

        //THEN
        expect(tableFounded).to.be.undefined
    })
})