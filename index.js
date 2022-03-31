'use strict'

module.exports = require('./lib')


const fs = require('fs')
const path = require('path')
const gameChangerParser = require("./lib")
const  deprecatedDirective  = require("./lib/type-generator/directive-management/deprecatedDirective");
const { getDirectives} = require( "@graphql-tools/utils")

const schemaCode = fs.readFileSync(path.join(__dirname, './graphql-examples', 'student.gql'), 'utf8')
const schemaJSON = gameChangerParser.schemaParser(schemaCode)
const types = gameChangerParser.typeGenerator(schemaJSON)

console.log('Generated types from json schema  : \n',types);