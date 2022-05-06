import {matchString} from "../../lib";
import {expect} from "chai";

describe('MatchString method', () => {
    it('Given a zip, should return chance.zip()', () => {
        //GIVEN
        const strings = ["Zip", "AreaCode"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.zip()")
        })
    })

    it('Given a city, should return chance.city()', () => {
        //GIVEN
        let strings = ["City", "Town", "Place", "Burgh"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.city()")
        })
    })

    it('Given an address, should return chance.street()', () => {
        //GIVEN
        let strings = ["Street", "Address"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.street()")
        })
    })

    it('Given a country, should return chance.country()', () => {
        //GIVEN
        let strings = ["Country", "Land", "Nation"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.country()")
        })
    })

    it('Given a state, should return chance.state()', () => {
        //GIVEN
        let string = "state"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.state()")
    })

    it('Given a latitude, should return chance.latitude()', () => {
        //GIVEN
        let string = "Latitude"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.latitude()")
    })

    it('Given a longitude, should return chance.longitude()', () => {
        //GIVEN
        let string = "Longitude"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.longitude()")
    })

    it('Given a color, should return chance.color()', () => {
        //GIVEN
        let string = "Color"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.color()")
    })

    it('Given a month, should return chance.month()', () => {
        //GIVEN
        let string = "Month"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.month()")
    })

    it('Given an email, should return chance.email()', () => {
        //GIVEN
        let string = "email"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.email()")
    })

    it('Given an url, should return chance.url()', () => {
        //GIVEN
        let strings = ["URL", "Link"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.url()")
        })
    })

    it('Given a title, should return chance.sentence()', () => {
        //GIVEN
        let strings = ["Title", "Head", "Sentence"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.sentence()")
        })
    })

    it('Given a text, should return chance.paragraph()', () => {
        //GIVEN
        let strings = ["Text", "Script", "Article", "Paper", "Blog", "Story", "Record"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.paragraph()")
        })
    })

    it('Given a firstname, should return chance.first()', () => {
        //GIVEN
        let strings = ["Firstname", "Name"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.first()")
        })
    })

    it('Given a lastname, should return chance.last()', () => {
        //GIVEN
        let string = "Lastname"

        //WHEN
        let result = matchString(string);
        //THEN
        expect(result).to.be.equals("chance.last()")
    })

    it('Given a job, should return chance.profession()', () => {
        //GIVEN
        let strings = ["Job", "Work", "Employment", "Business", "Occupation"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.profession()")
        })
    })

    it('Given a phone, should return chance.phone()', () => {
        //GIVEN
        let strings = ["Phone", "Call", "Contact"]

        //WHEN
        strings.forEach(str => {
            let result = matchString(str);
            //THEN
            expect(result).to.be.equals("chance.phone()")
        })
    })

    it('Given anything else, should return chance.word()', () => {
        //GIVEN
        let string = ""

        //WHEN
        let result = matchString(string);

        //THEN
        expect(result).to.be.equals("chance.word()")
    })
})