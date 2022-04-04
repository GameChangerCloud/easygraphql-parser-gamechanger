"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSQLTableName = void 0;
function getSQLTableName(typeName) {
    return typeName.charAt(0).toLowerCase() + typeName.slice(1)
        .replace(/([A-Z])/g, (e) => {
        return '_' + e.toLowerCase();
    })
        .replace(/(__)/g, '_');
}
exports.getSQLTableName = getSQLTableName;
;
