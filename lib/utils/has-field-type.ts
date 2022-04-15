import {IType} from "../models/type";

export const hasFieldType = (type: IType, fieldType: string) => {
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