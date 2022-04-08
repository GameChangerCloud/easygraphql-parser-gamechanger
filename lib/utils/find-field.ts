import {IField} from "../models/field";

export const findField = (fields: IField[], fieldName: string): IField | undefined  => {
    return fields.find(field => field.name === fieldName)
};