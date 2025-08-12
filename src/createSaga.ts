import z from "zod/v4";
import { Saga } from "./Saga";

// TODO: return the Saga class
/**
 * 
 */
export function createSaga<
    TSagaInput,
    TSagaOutput,
    TSagaInputSchema extends z.ZodSchema<TSagaInput>
>(params: { schema: TSagaInputSchema, emit: ({ input }: { input: z.infer<TSagaInputSchema> }) => TSagaOutput }): Saga<TSagaInput, TSagaOutput, TSagaInputSchema> {
    // TODO: return an actual Saga...
    const { schema, emit } = params;
    return new Saga({ schema, emit });
}