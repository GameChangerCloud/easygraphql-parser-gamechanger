"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFieldType = void 0;
const hasFieldType = (type, fieldType) => {
    let answers = false;
    let fieldInfo = null;
    type.fields.forEach(field => {
        if (field.type === fieldType) {
            answers = true;
            fieldInfo = field;
        }
    });
    return { fieldInfo: fieldInfo, answers: answers };
};
exports.hasFieldType = hasFieldType;
