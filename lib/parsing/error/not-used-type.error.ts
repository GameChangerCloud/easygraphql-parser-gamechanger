export class NotUsedTypeError extends Error {
    constructor(type: string) {
        super(`The type ${type} is not known`);
    }
}