import {
    getFieldsCreate,
    getFieldsInput,
    getFieldsName,
    getFieldsParsedHandler,
    Relationships,
} from "../../../lib";
import util from 'util'
import {expect} from "chai";
import fs from "fs";
import path from "path";


describe('get fields parsed methods', function () {
    describe('getFieldsInput', function () {
        it('should return a string based on different fields', function () {
            // GIVEN
            const fields = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../resources/parsing/fields-parsing/complete-fields.json'),
                'utf8'
            ));
            //WHEN
            const resultString = getFieldsInput(fields)
            const expectedString = 'id: { type: new GraphQLNonNull(GraphQLID) },\n' +
                '\t\ttitle: { type: GraphQLString },\n' +
                '\t\tposter: { type: GraphQLString },\n' +
                '\t\tactors: { type: new GraphQLList(ActorUpdateInput) },\n' +
                '\t\tstudio: { type: GraphQLID },\n' +
                '\t\toscars: { type: new GraphQLList(OscarUpdateInput) },\n' +
                '\t\tsequel: { type: GraphQLID },\n' +
                '\t\tsynopsis: { type: GraphQLID },\n' +
                '\t\tisEnglish: { type: GraphQLBoolean },\n' +
                '\t\tpoints: { type: new GraphQLNonNull(GraphQLInt) },\n' +
                '\t\tlaunchDate: { type: GraphQLID },\n'
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
    describe('getFieldsParsedHandler', function () {
        it('should return a string based on different fields', function () {
            // GIVEN
            const fields = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../resources/parsing/fields-parsing/complete-fields.json'),
                'utf8'
            ));
            const currentTypeName = "Movie"
            //WHEN
            const resultString = getFieldsParsedHandler(currentTypeName, fields, false, "")
            const expectedString = '\t\t\tid: data.Pk_Movie_id,\n' +
                '\t\t\ttitle: data.title,\n' +
                '\t\t\tposter: data.poster,\n' +
                '\t\t\tactors: data.actors,\n' +
                '\t\t\tstudio: data.studio,\n' +
                '\t\t\toscars: data.oscars,\n' +
                '\t\t\tsequel: data.sequel,\n' +
                '\t\t\tsynopsis: data.synopsis,\n' +
                '\t\t\tisEnglish: data.isEnglish,\n' +
                '\t\t\tpoints: data.points,\n' +
                '\t\t\tlaunchDate: data.launchDate\n'
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
    describe('getFieldsCreate', function () {
        it('should return a string based on different fields', function () {
            // GIVEN
            const fields = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../resources/parsing/fields-parsing/complete-fields.json'),
                'utf8'
            ));
            const currentTypeName = "Movie"
            //WHEN
            const resultString = getFieldsCreate(currentTypeName, fields, Relationships, "")
            const expectedString = 'utils.escapeQuote(args.title) + "," + utils.escapeQuote(args.poster) + "," + args.isEnglish + "," + args.points + "," + utils.escapeQuote(args.launchDate)'
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
    describe('getFieldsName', function () {
        it('should return a string based on different fields', function () {
            // GIVEN
            const fields = JSON.parse(fs.readFileSync(
                path.join(__dirname, '../../resources/parsing/fields-parsing/complete-fields.json'),
                'utf8'
            ));
            const currentTypeName = "Movie"
            //WHEN
            const resultString = getFieldsName("", fields, currentTypeName, "", Relationships)
            const expectedString = '\\"title\\",\\"poster\\",\\"isEnglish\\",\\"points\\",\\"launchDate\\"'
            // THEN
            expect(resultString).to.exist
            expect(resultString).to.be.deep.equals(expectedString)
        })
    })
});
