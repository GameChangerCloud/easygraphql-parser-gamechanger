'use strict'

module.exports = require('./lib')


const fs = require('fs')
const path = require('path')
const easygraphqlSchemaParser = require('./lib/schemaParser.js')

const  deprecatedDirective  = require("./lib/deprecatedDirective");

const { getDirectives} = require( "@graphql-tools/utils")

//const { deprecatedDirectiveTypeDefs, deprecatedDirectiveTransformer } = deprecatedDirective('deprecated');

const schemaCode = fs.readFileSync(path.join(__dirname, './graphql-examples', 'blog.graphql'), 'utf8')


const chegue = `
type ExampleType {
  newField: String
  oldField: String @deprecated(reason: "Use \`newField\`.")
}

type Query {
  rootField: ExampleType
}
`



const schema = easygraphqlSchemaParser(schemaCode)
const schemaTransform = deprecatedDirective('deprecated');
//const newSchema = schemaTransform.deprecatedDirectiveTransformer(chegue);




//console.log(getDirectives(chegue))
fs.writeFile("schema.json", JSON.stringify(schema, null, 4),(err) => {
    if (err) {
        throw err;
    }
    console.log("JSON data is saved.");
});