import {getResolveType} from "../../lib";
import {expect} from "chai";
import {IType} from "../../lib/models/type";


describe('get resolve type', function () {
    it('should return a String built with implemented types', function () {
        // GIVEN
        const type: IType = {
            "type": "InterfaceTypeDefinition",
            "typeName": "User",
            "sqlTypeName": "user",
            "description": "",
            "directives": [],
            "fields": [],
            "implementedTypes": [
                "Student",
                "Teacher"
            ],
            "relationList": []
        }
        //WHEN
        const resultString = getResolveType(type)
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