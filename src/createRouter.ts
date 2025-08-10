import EventEmitter from "events";

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
    TRouterRecord extends { [key: string]: SagaCaller<any, any> }
>(emitter: EventEmitter, routes: TRouterRecord): RouterRecordEmitters<TRouterRecord> {
    const result: TRouterRecord = {} as any;

    for (const key of Object.keys(routes) as (keyof TRouterRecord)[]) {
        const { emit } = routes[key];

        emitter.on(key as string | symbol, (input: Parameters<typeof emit>[0]) => {
            // TODO: Validate the input against the schema
            emit({ input });
        });

        // Put each route directly on the instance
        result[key] = routes[key];
    }

    return result as any;
}