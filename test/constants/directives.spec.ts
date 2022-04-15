import {directives} from "../../lib";
import util from 'util'
import {expect} from "chai";
import fs from "fs";
import path from "path";


describe('directives methods', function () {
    describe('selector methods', function () {
        const types = JSON.parse(fs.readFileSync(
            path.join(__dirname, "../resources/schema-types/movies-directives-types.json"),
            'utf8'
        ));
        it('should return fields names table', function () {
            // GIVEN
            const givenField = {
        "name": "creationYear",
        "type": "Studio",
        "noNullArrayValues": false,
        "noNull": false,
        "isArray": false,
        "directives": [
            {
                "name": "selector",
                "args": []
            }
        ],
        "arguments": [],
        "isDeprecated": false,
        "foreign_key": null,
        "relation": false,
        "delegated_field": {
            "state": false,
            "side": null,
            "associatedWith": {
                "type": null,
                "fieldName": null
            }
        },
        "in_model": true,
        "joinTable": {
            "state": false,
            "name": null,
            "contains": []
        },
        "oneToOneInfo": null,
        "sqlType": "int"
    }
            //WHEN
            const resultString = directives.selector.resolve(givenField, types)
            const expectedString = [ 'name', 'creationYear' ]
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
        it('should return a table with id String', function () {
            // GIVEN
            const givenField = {
                "name": "creationYear",
                "type": "Int",
                "noNullArrayValues": false,
                "noNull": false,
                "isArray": false,
                "directives": [
                    {
                        "name": "selector",
                        "args": []
                    }
                ],
                "arguments": [],
                "isDeprecated": false,
                "foreign_key": null,
                "relation": false,
                "delegated_field": {
                    "state": false,
                    "side": null,
                    "associatedWith": {
                        "type": null,
                        "fieldName": null
                    }
                },
                "in_model": true,
                "joinTable": {
                    "state": false,
                    "name": null,
                    "contains": []
                },
                "oneToOneInfo": null,
                "sqlType": "int"
            }
            //WHEN
            const resultString = directives.selector.resolve(givenField, types)
            const expectedString = [ 'id' ]
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
});