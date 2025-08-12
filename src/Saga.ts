import EventEmitter from "events";
import z from "zod";

/**
 * Encapsulates an EventEmitter to provide strong typing on the Input/Output
 */
class Saga<
    TSagaInput,
    TSagaOutput,
    TSagaInputSchema extends z.ZodSchema<TSagaInput>
> {
    /**
     * The schema for the input to the saga.
     */
    readonly schema: TSagaInputSchema;

    private readonly emitter: EventEmitter;

    /**
     * Runs the execute function of this saga with the provided input
     */
    readonly emit: ({ input }: { input: z.infer<TSagaInputSchema> }) => TSagaOutput;

    constructor({
        emitter,
        schema,
        emit
    }: {
        emitter: EventEmitter,
        schema: TSagaInputSchema,
        emit: ({ input }: { input: z.infer<TSagaInputSchema> }) => TSagaOutput
    }) {
        this.schema = schema;
        this.emitter = emitter;
        // TODO: we possibly wanna bind this with a try/catch and structure the rollback runner around it
        this.emit = emit;
    }
}

export {
    type Saga
}