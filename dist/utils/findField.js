"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findField = void 0;
const findField = (fields, columnName) => {
    for (let pos in fields) {
        if (fields[pos].field === columnName) {
            return fields[pos];
        }
    }
    return undefined;
};
exports.findField = findField;
