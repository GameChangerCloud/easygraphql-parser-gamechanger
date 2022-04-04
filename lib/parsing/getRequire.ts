/** Fonction principale */

// Build the require const type string
export const getRequire = (type, defaultScalars) => {
    const requiredTypes = getRequireTypes(type, defaultScalars)
    let result = ""
    for (let index = 0; index < requiredTypes.length; index++) {
        if (!defaultScalars.includes(requiredTypes[index])) {
            result += "const " + requiredTypes[index] + "Type = require('./" + requiredTypes[index].toLowerCase() + "')\n"
            // result += "const " + requiredTypes[index] + "UpdateInput = require('./" + requiredTypes[index].toLowerCase() + "UpdateInput')\n"
        }
    }
    return result
}

/** Fonction utilitaire */
// Get all the types required, except the current one, to import in file
const getRequireTypes = (currentType, defaultScalars) => {
    let result :any = []
    currentType.fields.forEach(field => {
        let type = field.type
        if (type !== currentType) {
            if (type !== "String" && type !== "ID" && type !== "Int" && type != "Boolean") { // If it's a predefined scalars no need to include it
                if (!defaultScalars.includes(type)) { // Check if it's not already included (multiple type call in Query)
                    if (! result.includes(type))
                        result.push(type)
                }
            }
        }
        // Checking internal argument (for the query mainly if there's enum in place)
        field.args.forEach(arg => {
            if (arg.type !== currentType) {
                if (arg.type !== "String" && arg.type !== "ID" && arg.type !== "Int" && arg.type != "Boolean") { // Check if it's not already included (multiple type call in Query)
                    if (! result.includes(arg.type))
                        result.push(arg.type)
                }
            }
        })
    })
    return result
}