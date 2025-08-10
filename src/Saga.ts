/**
 * Unanswered technical questions:
 * [ ] Why do we need the TOutput for the Saga
 * 
 * TODO:
 * [ ] Caller factory should only inherit the type definitions and the base EventEmitter class
 *      - We probably don't need references to the callback function definitions for each EventEmitter
 *          - This will all be handled by Node in the back-end anyways
 * [ ]  How do we know when a set of sagas are done?
 * [ ]  How do we collect the results of the sagas?
 * 
 * Pattern:
 * 1. Define the Sagas (extension of an EventEmitter with strong typing on i/o)
 *      -  TODO: how do we provide context to the sagas 
 *          e.g. db.transaction, caller to SagaFactory that provides ability to emit to other Sagas?
 *          second part may not be as hard as I think it'd be as there is 'loose' coupling between the  
 *          implementation and the underlying EventEmitter
 * 2. Add the Saga to the Saga caller 
 * 
 * const sagas = Sagas.create({
 *      CreateBaseEvent: new Saga({
 *          ...
 *          // TODO: what properties do we need to define on this handler
 *          
 *      })
 * })
 * 
 * 
 */

import EventEmitter from "events";
import z from "zod";


// TODO: Need a factory for this so we can pass the same instance of EventEmitter()
// This factory will be whats used in the SagaRouter class
// TODO: does each saga need a unique name?
// const array of names for the saga?

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
    }

    /**
     * Runs the execute function of this saga with the provided input
     */
    emit({ input }: { input: z.infer<TSagaInputSchema> }): TSagaOutput {
        return {} as any;
    }
}

// TODO: bind the EventEmitter

// TODO: this needs to be a static class
class SagaBuilder {
    readonly emitter: EventEmitter;

    // TODO: this needs to pass through the available routes to the builder for access
    // TODO: we also need to expose the type of this class so we can pass it into any functions
    // that we define outside to hide away the creation logic of each saga
    readonly callers: Record<string, Saga<any, any, any>> = {};

    constructor(emitter: EventEmitter) {
        this.emitter = emitter;
    }

    // TODO: return the Saga class
    createSaga<
        TSagaInput,
        TSagaOutput,
        TSagaInputSchema extends z.ZodSchema<TSagaInput>
    >(params: { schema: TSagaInputSchema, emit: ({ input }: { input: z.infer<TSagaInputSchema> }) => TSagaOutput }): Saga<TSagaInput, TSagaOutput, TSagaInputSchema> {
        // TODO: return an actual Saga...
        return {} as any;
    }

    // TODO: strong typing for this
    // We need to return
    createRouter(routes: Record<string, Saga<any, any, any>>): SagaRouter {
        // TODO: we need to bind the EventEmitter
        for (const [name, saga] of Object.entries(routes)) {
            // TODO: the 'emit' function needs to be bound to the EventEmitter class
            // TODO: we should only expose the 'emit' function
            this.callers[name] = saga;
        }
    }
}

interface SagaCaller<TSagaInput, TSagaOutput> {
    emit: ({ input }: { input: TSagaInput }) => TSagaOutput;
}

type RouterRecordEmitters<TRouterRecord extends { [key: string]: SagaCaller<any, any> }> = {
    [key in keyof TRouterRecord]: TRouterRecord[key] extends SagaCaller<any, any> ? { emit: TRouterRecord[key]["emit"] } : never
}

function createSagaRouter<
    TRouterRecord extends { [key: string]: SagaCaller<any, any> }
>(routes: TRouterRecord): RouterRecordEmitters<TRouterRecord> {
    const result: TRouterRecord = {} as any;

    for (const key of Object.keys(routes) as (keyof TRouterRecord)[]) {
        // put each route directly on the instance
        result[key] = routes[key];
    }

    return result as any;
}

const emitter = new EventEmitter();
const sagas = new SagaBuilder(emitter);

const createBookingSaga = sagas.createSaga({
    schema: z.object({
        flightId: z.string(),
    }),
    emit: ({ input, router }) => {
        sagas.callers.createFlightItinerary.emit({ input: "" });

        // ... call AWS
        // .. insert to DB

        router.createBooking.emit("");
        router.createNotification.emit();
    }
});

// TODO: this should return a typed object that defines the possible routes that can be called on a saga.
// We can pass this SagaRouter to the creation of other Sagas
// TODO: maybe we expose a version of this SagaRouter to the createRouter e.g.
// const sagaRouter = sagas.createRouter(router => ({ ... } )); 
// const sagaRouter = sagas.createRouter({
const sagaRouter = createSagaRouter({
    createBooking: createBookingSaga,
    createItinerary: createBookingSaga
});

sagaRouter.createBooking.emit({ input: { flightId: "123" } });
sagaRouter.createItinerary.emit({ input: { flightId: "123" } });


// // type SagaRouter = typeof sagaRouter;
// sagaRouter.routes.createBooking.emit({ input: { flightId: "123" } });

// sagaRouter.routes.createBooking.emit("")

export {
    type Saga
}

/**
 * If we define it as
 * 
 * const sagaRouter = new SagaRouter({
 *      createBooking: ... <- we would need to pass the SagaFactory so we can access the same EventEmitter instance
 * });
 * 
 * Maybe we pass a callback function
 * 
 * e.g. expose ({ builder }) => createBookingSaga(builder);
 * 
 * and we can import that funciton elsewhere e.g.
 * function createBookingSaga(builder: SagaBuilder) {
 *      return new Saga({ ... });
 * }
 * 
 *  The question still -> how do we access the collectin of routes in the builder to emit events to other sagas?
 *      - Might be able to... We have access to the EventEmitter instance along with
 *        the routes available
 */