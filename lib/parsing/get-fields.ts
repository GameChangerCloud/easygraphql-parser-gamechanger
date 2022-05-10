/**
 * From a type object, get the fields and return an array of it
 * @param {*} type
 * @returns
 */
import {IType} from "../models/type";

// Get all directive names from the fields of a type object
export const getFieldsDirectiveNames = (type:IType) => {
    let directiveNames: string[] = [];
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