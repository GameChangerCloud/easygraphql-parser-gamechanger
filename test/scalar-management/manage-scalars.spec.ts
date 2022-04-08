import {getSQLTableName, isBasicType, isScalar, Scalars} from "../../lib";
import {expect} from "chai";
import exp = require("constants");
import {getFieldCreate, getFieldName} from "../../lib/scalar-managment/manage-scalars";

describe('scalar-management methods', () => {

    let defaultScalars = ['String', 'ID', 'Int', 'Boolean', 'Float'];
    let customScalars = Object.values(Scalars);

    describe('isScalar method', () => {

        it('Given a default scalar or a personalized one, should return true', () => {
            //GIVEN
            let allScalars = [...customScalars, ...defaultScalars];

            //WHEN
            allScalars.forEach(scalar => {
                //THEN
                expect(isScalar(scalar)).to.be.true;
            })
        })

        it('Given unknown scalar, should return false', () => {
            expect(isScalar("Temperature")).to.be.false
        })
    })

    describe('isBasicType method', () => {
        it('Given a default scalar, should return true', () => {
            //GIVEN defaultScalars

            //WHEN
            defaultScalars.forEach(scalar => {
                //THEN
                expect(isBasicType(scalar)).to.be.true
            })
        });

        it('Given unknown scalar, should return false', () => {
            expect(isBasicType("Long")).to.be.false
        })
    })

    describe('getFieldCreate method', () => {
        it('Given scalar, should return right string', () => {
            //GIVEN
            let types = ["Time", "String", "Date", "RGB", "RGBA", "HSL", "HSLA", "HexColorCode", "Time"];
            let name = "hours"
            let expected = `utils.escapeQuote(args.${name})`

            //WHEN
            types.forEach(type => {
                let result = getFieldCreate(type, name);

                //THEN
                expect(result).to.be.equals(expected);
            })

        })

        it('Given scalar, should return right string', () => {
            //GIVEN
            let types = ["ID", "Boolean", "Int"];
            let name = "hours"
            let expected = `args.${name}`

            //WHEN
            types.forEach(type => {
                let result = getFieldCreate(type, name);

                //THEN
                expect(result).to.be.equals(expected);
            })
        })

        it('Given a wrong scalar, should return "" string', () => {
            //GIVEN
            let type = "GameChanger";
            let name = "gameChanger";
            let expected = "";

            //WHEN
            let result = getFieldCreate(type, name);

            //THEN
            expect(result).to.be.equals(expected)
        })
    })

    describe('GetFieldName method', () => {
        it('Given ID scalar, should return primaryKey name', () => {
            //GIVEN
            let type = "Id";
            let scalar = "ID";
            let name = "Movie";
            let expected = "\\\"Pk_" + getSQLTableName(type) + "_id\\\"";

            //WHEN
            let result = getFieldName(scalar, name, type)

            //THEN
            expect(result).to.be.equals(expected)
        })

        it('Given default scalars and custom scalars except ID, should return name', () => {
            //GIVEN
            let type = "type";
            let name = "Movie";
            let expected = "\\\"" + name + "\\\"";

            //WHEN
            customScalars.forEach(scalar => {
                let result = getFieldName(scalar, name, type)

                //THEN
                expect(result).to.be.equals(expected)
            })
        })

        it('Given default except ID or wrong scalars, should return "" string', () => {
            //GIVEN
            let wrongScalar = "Temperature";
            let type = "type";
            let name = "Movie";
            let expected = "";

            //WHEN
            let result = getFieldName(wrongScalar, name, type)

            //THEN
            expect(result).to.be.equals(expected);
        })
    })
})
