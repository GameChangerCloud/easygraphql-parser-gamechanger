"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnumValues = void 0;
const getEnumValues = (currentType) => {
    let result = "";
    let integerValue = 0;
    currentType.values.forEach(value => {
        result += value + ": {\n\tvalue: " + integerValue + "\n},";
        integerValue++;
    });
    return result;
};
exports.getEnumValues = getEnumValues;
