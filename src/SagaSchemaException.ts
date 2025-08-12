/**
 * 
 */
export class SagaSchemaException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "SagaSchemaException"; 
        Object.setPrototypeOf(this, SagaSchemaException.prototype);
    }
}