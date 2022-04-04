import {Type} from "../models/Type";

export const hasFieldType = (type: Type, fieldType: string) => {
    let answers = false;
    let fieldInfo: any = null;
    type.fields.forEach(field => {
        if (field.type === fieldType) {
            answers = true;
            fieldInfo = field;
        }
    });
    return { fieldInfo: fieldInfo, answers: answers };
};