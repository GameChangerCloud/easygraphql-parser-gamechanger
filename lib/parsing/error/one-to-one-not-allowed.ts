export class OneToOneRelationNotAllowedError extends Error {
    constructor() {
        super(`Bidirectional One to One relation not allowed`);
    }
}