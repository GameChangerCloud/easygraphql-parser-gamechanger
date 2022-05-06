/** Fonction principale */
import {isBasicScalar, isPersonalizedScalar, isScalar} from "../scalar-managment/manage-scalars";

// Build the require const type string
export const getRequire = (type) => {
    const requiredTypes = getRequireTypes(type)
    let result = ""
    for (let index = 0; index < requiredTypes.length; index++) {
        if (!isPersonalizedScalar(requiredTypes[index])) {
            result += "const " + requiredTypes[index] + "Type = require('./" + requiredTypes[index].toLowerCase() + "')\n"
        }
    }
    return result
}

/** Fonction utilitaire */
// Get all the types required, except the current one, to import in file
const getRequireTypes = (currentType) => {
    let result: any = []
    currentType.fields.forEach(field => {
        let fieldType = field.type
        if (fieldType !== currentType) {
            if (!isScalar(fieldType)) { // If it's a predefined scalars no need to include it
                if (!result.includes(fieldType))
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