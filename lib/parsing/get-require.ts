import {IType} from "../models/type";
import {isBasicScalar, isScalar} from "../scalar-managment/manage-scalars";

/** Fonction principale */

// Build the require const type string
export const getRequire = (type: IType) => {
    const requiredTypes = getRequireTypes(type)
    let result = ""
    for (let requiredType of requiredTypes) {
        if (!isScalar(requiredType)) {
            result += "const " + requiredType + "Type = require('./" + requiredType.toLowerCase() + "')\n"
        }
    }
    return result
}

/** Fonction utilitaire */
// Get all the types required, except the current one, to import in file
const getRequireTypes = (currentType: IType): string[] => {
    let result: any = []
    currentType.fields.forEach(field => {
        let fieldType = field.type
        if (fieldType !== currentType.typeName) {
            if (!isScalar(fieldType)) { // If it's a predefined scalars no need to include it
                if (!result.includes(fieldType))  // Check if it's not already included (multiple type call in Query)
                    result.push(fieldType)
            }
        }
        // Checking internal argument (for the query mainly if there's enum in place)
        field.arguments.forEach(arg => {
            if (arg.type !== currentType) {
                if (!isBasicScalar(arg.type)) { // Check if it's not already included (multiple type call in Query)
                    if (!result.includes(arg.type))
                        result.push(arg.type)
                }
            }
        })
    })
    return result
}