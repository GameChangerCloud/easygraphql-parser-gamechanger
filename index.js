'use strict'

module.exports = require('./lib')


const fs = require('fs')
const path = require('path')
const easygraphqlSchemaParser = require('./lib/schemaParser.js')

const  deprecatedDirective  = require("./lib/deprecatedDirective");

const { getDirectives} = require( "@graphql-tools/utils")

