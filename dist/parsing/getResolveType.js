"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResolveType = void 0;
const getResolveType = (type, currentTypeName) => {
    let result = "";
    let implementedTypes = type.implementedTypes;
    implementedTypes.forEach(implementedType => {
        result += "\t\t\tcase \"" + implementedType + "\":\n";
        result += "\t\t\t\treturn " + implementedType + "Type\n";
    });
    result += "\t\t\tdefault: \n\t\t\t\treturn " + currentTypeName + "Type";
    return result;
};
exports.getResolveType = getResolveType;
