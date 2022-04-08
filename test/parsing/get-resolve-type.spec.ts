import {getAllTables, getRelations, getResolveType, schemaParser, Type} from "../../lib";
import fs from "fs";
import path from "path";
import util from "util";
import {expect} from "chai";


describe('get resolve type', function () {
    describe('getResolveType', function () {
        it('should return a String built with implemented types', function () {
            // GIVEN
            const type = {
                "type": "InterfaceTypeDefinition",
                "typeName": "User",
                "sqlTypeName": "user",
                "description": "",
                "directives": [],
                "fields": [
                    {
                        "name": "email",
                        "type": "String",
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
                        "name": "username",
                        "type": "String",
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
                    }
                ],
                "implementedTypes": [
                    "Student",
                    "Teacher"
                ],
                "relationList": []
            }
            const currentTypeName = "User";
            //WHEN
            const resultString = getResolveType(type, currentTypeName)
            const expectedString = "\t\t\tcase \"Student\":\n" +
                "\t\t\t\treturn StudentType\n" +
                "\t\t\tcase \"Teacher\":\n" +
                "\t\t\t\treturn TeacherType\n" +
                "\t\t\tdefault: \n" +
                "\t\t\t\treturn UserType"
            // THEN
            expect(resultString).to.be.equals(expectedString)
        });
    })
})