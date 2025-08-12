import z from "zod/v4";
import { Saga } from "./Saga";

/**
 * 
 */
export function createSaga<
    TSagaInput,
    TSagaOutput,
    TSagaInputSchema extends z.ZodSchema<TSagaInput>
>(params: { schema: TSagaInputSchema, emit: ({ input }: { input: z.infer<TSagaInputSchema> }) => TSagaOutput }): Saga<TSagaInput, TSagaOutput, TSagaInputSchema> {
    const { schema, emit } = params;
    return new Saga({ schema, emit });
}