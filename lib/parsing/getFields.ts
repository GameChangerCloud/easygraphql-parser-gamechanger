/**
 * From a type object, get the fields and return an array of it
 * @param {*} type
 * @returns
 */
export const getFields = (type) => {
    let fields: any[] = []
    for (let index = 0; index < type["fields"].length; index++) {
        fields.push(type["fields"][index])
    }
    return fields
}

// Get all directive names from the fields of a type object
export const getFieldsDirectiveNames = (type) => {
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