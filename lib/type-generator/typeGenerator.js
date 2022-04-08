'use strict'
const Type_1 = require('../models/type')
const {isSchemaValid} = require('../utils/is-schema-valid')

function typesGenerator(schemaJSON) {

  // TODO Passage au ts et ajout du field ID si non présent
  console.log('Type Generation started :', schemaJSON)
  this.types = Type_1.Type.initTypes(schemaJSON)
  let isValidSchema = isSchemaValid(this.types)
  if (!isValidSchema.response) {
    throw new Error(
      'Incorrect schema, please write a valid graphql schema based on the supported guidelines.\nReason: ' +
        isValidSchema.reason
    )
  } else {
    console.log('Valid schema')
    // TODO Add more information for each type
  }
  return this.types
}

module.exports = typesGenerator
