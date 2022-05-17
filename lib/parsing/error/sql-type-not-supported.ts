export class SQLTypeNotSupported extends Error {
    constructor(fieldType:string) {
        super(`field's type ${fieldType} has not supported sql type`);
    }
}