import fs from "fs";
import path from "path";
import {
    getJoinTables,
    getQuerySelfJoinMany,
    getQuerySelfJoinOne,
} from "../../../lib";
import {expect} from "chai";
import util from "util";

describe('relations parsing', () => {
    describe('getJoinTables', () => {
        it('Should return all relations selfJoinMany, manyToMany and manyToOne from the type', () => {
            //GIVEN
            let types;
            types = JSON.parse(fs.readFileSync(
                path.join(__dirname, "../../resources/parsing/relations-parsing/types.json"),
                'utf8'
            ));
            //WHEN
            const joinTables = getJoinTables(types)
            const expectedTypes = JSON.parse(fs.readFileSync(
                path.join(__dirname, "../../resources/parsing/relations-parsing/expected-table.json"),
                'utf8'
            ));
            //THEN
            expect(joinTables).to.exist
            expect(joinTables).to.deep.equals(expectedTypes);
        })
    })
    describe('getQuerySelfJoinOne', () => {
        const fields = [{
            "name": "teaser",
            "type": "Movie",
            "noNullArrayValues": false,
            "noNull": false,
            "isArray": false,
            "directives": [],
            "arguments": [],
            "isDeprecated": false,
            "foreign_key": {
                "name": "Fk_teaser_movie_id",
                "type": "int",
                "noNull": false,
                "isArray": false,
                "foreignKey": true,
                "constraint": "FOREIGN KEY (\"Fk_teaser_movie_id\") REFERENCES \"movie\" (\"Pk_movie_id\")"
            },
            "relation": true,
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
            "sqlType": "int",
            "relationType": "selfJoinOne"
        },
            {
                "name": "id",
                "type": "ID",
                "noNullArrayValues": false,
                "noNull": true,
                "isArray": false,
                "directives": [],
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
            }]
        it('Should return a string which only take selfJoinMany relation', () => {
            //GIVEN
            const currentTypeName = "Movie"
            const resultString = getQuerySelfJoinOne(currentTypeName, fields)
            //WHEN
            const expectedString = "SELECT * FROM \"Movie\" as t1 WHERE t1.\"Pk_Employe_id\" = (SELECT \"teaser_id\" FROM  \"Movie\" WHERE \"Movie\".\"Pk_Movie_id\" = :value)"
            //THEN
            expect(resultString).to.exist
            expect(resultString).to.be.equals(expectedString)
        })
        it('Should return a empty string', () => {
            //GIVEN
            const currentTypeName = "Studio"
            const resultString = getQuerySelfJoinOne(currentTypeName, fields)
            //WHEN
            const expectedString = ""
            //THEN
            expect(resultString).to.exist
            expect(resultString).to.be.equals(expectedString)
        })
    })
    describe('getQuerySelfJoinMany', () => {
        const fields = [
            {
                "name": "id",
                "type": "ID",
                "noNullArrayValues": false,
                "noNull": true,
                "isArray": false,
                "directives": [],
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
            },
            {
                "name": "teasers",
                "type": "Movie",
                "noNullArrayValues": false,
                "noNull": false,
                "isArray": true,
                "directives": [],
                "arguments": [],
                "isDeprecated": false,
                "foreign_key": null,
                "relation": true,
                "delegated_field": {
                    "state": false,
                    "side": null,
                    "associatedWith": {
                        "type": null,
                        "fieldName": null
                    }
                },
                "in_model": false,
                "joinTable": {
                    "state": true,
                    "name": "Movie_Movie_teasers",
                    "contains": [
                        {
                            "fieldName": "teasers",
                            "type": "Movie",
                            "constraint": "FOREIGN KEY (\"teasers_id\") REFERENCES \"movie\" (\"Pk_movie_id\")"
                        },
                        {
                            "fieldName": "movie",
                            "type": "Movie",
                            "constraint": "FOREIGN KEY (\"movie_id\") REFERENCES \"movie\" (\"Pk_movie_id\")"
                        }
                    ]
                },
                "oneToOneInfo": null,
                "sqlType": "int",
                "relationType": "selfJoinMany",
                "activeSide": true
            }
        ]
        it('Should return a string which only take SelfJoinMany relation', () => {
            //GIVEN
            const currentTypeName = "Movie"
            const resultString = getQuerySelfJoinMany(currentTypeName, fields)
            //WHEN
            const expectedString = "SELECT t2.* FROM \"Movie\" as t1 LEFT OUTER JOIN \"Movie_teasers\" as joint ON t1.\"Pk_Movie_id\" = joint.\"movie_id\" LEFT OUTER JOIN \"Movie\" as t2 ON joint.teasers_id = t2.\"Pk_Movie_id\" WHERE t1.\"Pk_Movie_id\" = :value '+sorting+' '+limit+' '+offset"
            //THEN
            expect(resultString).to.exist
            expect(resultString).to.be.equals(expectedString)
        })
        it('Should return a empty string', () => {

            //GIVEN
            const currentTypeName = "Studio"
            const resultString = getQuerySelfJoinOne(currentTypeName, fields)
            //WHEN
            const expectedString = ""
            //THEN
            expect(resultString).to.exist
            expect(resultString).to.be.equals(expectedString)

        })
    })

})