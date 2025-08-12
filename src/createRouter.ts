import EventEmitter from "events";
import { type Saga } from "./Saga";
import z from "zod/v4";
import { SagaSchemaException } from "./SagaSchemaException";

/**
 * Helpers to only expose the 'emit' function in the RouterRecord
 */
interface SagaCaller<TSagaInput, TSagaOutput> {
    emit: ({ input }: { input: TSagaInput }) => TSagaOutput;
}

type RouterRecordEmitters<TRouterRecord extends { [key: string]: SagaCaller<any, any> }> = {
    [key in keyof TRouterRecord]: TRouterRecord[key] extends SagaCaller<any, any> ? { emit: TRouterRecord[key]["emit"] } : never
}

/**
 * Binds the EventEmitter to the Saga to create a set of routes that can be called
 * Aggregates the routes into a single object that exposes the 'emit' function
 * Also binds the EventEmitter callers to the routes.
 * @param emitter 
 * @param routes 
 * @returns 
 */
export function createRouter<
    TRouterRecord extends { [key: string]: Saga<any, any, any> }
>(emitter: EventEmitter, routes: TRouterRecord): RouterRecordEmitters<TRouterRecord> {
    const result: TRouterRecord = {} as any;

    for (const key of Object.keys(routes) as (keyof TRouterRecord)[]) {
        const { emit, schema } = routes[key] as { emit: any, schema: z.ZodSchema<any> };

        // TODO: "key as string | symbol" may need to be re-evaludated... are we able to pass other key types into here?
        emitter.on(key as string | symbol, (input: Parameters<typeof emit>[0]) => {
            try {
                schema.safeParse(input);
                emit({ input });
            } catch (error) {
                throw new SagaSchemaException(`Error parsing the schema for the Saga '${String(key)}': ${JSON.stringify(error)}`);
            }
        });

        // Put each route directly on the instance
        result[key] = routes[key];
    }

    return result as any;
}