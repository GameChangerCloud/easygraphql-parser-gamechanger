import {expect} from "chai";
import {getSQLTableName} from "../../lib";

describe('getSQLTableName function', () => {

    it('Given Movie, should return movie', () => {
        const typeName = "Movie";
        const expected = "movie";
        expect(getSQLTableName(typeName)).to.exist.and.to.be.equals(expected)
    })

    it('Given MovieTheater, should return movie_theater', () => {
        const typeName = "MovieTheater";
        const expected = "movie_theater";

        expect(getSQLTableName(typeName)).to.exist.and.to.be.equals(expected)
    })

    it('Given TableSQL, should return table_sql', () => {
        const typeName = "TableSQL";
        const expected = "table_sql";

        expect(getSQLTableName(typeName)).to.exist.and.to.be.equals(expected)
    })

    it('Given RGBA, should return rgba', () => {
        const typeName = "RGBA";
        const expected = "rgba";

        expect(getSQLTableName(typeName)).to.exist.and.to.be.equals(expected)
    })
})