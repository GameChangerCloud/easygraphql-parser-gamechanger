"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDirectivesNames = void 0;
const directives_1 = require("../constants/directives");
const getDirectivesNames = () => {
    let names = [];
    for (let elem in directives_1.directives) {
        names.push(elem);
    }
    console.log(names);
    return names;
};
exports.getDirectivesNames = getDirectivesNames;
