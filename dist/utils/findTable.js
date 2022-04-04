"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findTable = void 0;
const findTable = (tables, name) => {
    for (let table in tables) {
        if (tables[table].name == name) {
            return tables[table];
        }
    }
    return undefined;
};
exports.findTable = findTable;
