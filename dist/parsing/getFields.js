"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFieldsDirectiveNames = exports.getFields = void 0;
/**
 * From a type object, get the fields and return an array of it
 * @param {*} type
 * @returns
 */
const getFields = (type) => {
    let fields = [];
    for (let index = 0; index < type["fields"].length; index++) {
        fields.push(type["fields"][index]);
    }
    return fields;
};
exports.getFields = getFields;
// Get all directive names from the fields of a type object
const getFieldsDirectiveNames = (type) => {
    let directiveNames = [];
    if (type.directives.length > 0) {
        type.directives.forEach(directive => {
            directiveNames.push(directive.name);
        });
    }
    type.fields.forEach(field => {
        if (field.directives.length > 0) {
            field.directives.forEach(directive => {
                directiveNames.push(directive.name);
            });
        }
    });
    return directiveNames;
};
exports.getFieldsDirectiveNames = getFieldsDirectiveNames;
