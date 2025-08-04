api.dummy.getPost.useQuery();

sagas.createBookingSaga.emit({
    bookingRef: ...,
    ...
});

/**
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


import { api } from "@/trpc/server";
import EventEmitter from "events";
import type z from "zod";


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

    readonly emitter: EventEmitter;

    constructor({
        emitter,
        schema,
        emit
    }: {
        emitter: EventEmitter,
        schema: TSagaInputSchema,
        emit: (input: TSagaInput) => TSagaOutput
    }) {
        this.schema = schema;
        this.emitter = emitter;
    }

    // Notify the listeners of this saga of an event
    private emit({ input }: { input: TSagaInput }) {
        // TODO: loop through listeners and pass the input to them
    }
}

// TODO: push/pull

// TODO: this needs to be a static class
class SagaBuilder {
    readonly emitter: EventEmitter;

    // TODO: this needs to pass through the available routes to the builder for access
    // TODO: we also need to expose the type of this class so we can pass it into any functions
    // that we define outside to hide away the creation logic of each saga
    readonly sagas: any;

    constructor(emitter: EventEmitter) {
        this.emitter = emitter;
    }

    // TODO: return the Saga class
    createSaga<T>(): T {
        return {} as any;
    }
}



const emitter = new EventEmitter();
const router = new SagaBuilder(emitter);

interface CreateBookingSaga {
    bookingId: number;
    name: string;
}

const createBookingSaga = router.createSaga<CreateBookingSaga>({
    schema: z.object({ ...}),
    execute: ({  }) => {
        router.createFlightItinerary.emit("")
    }
});

router.addRoutes({
    createBooking: createBookingSaga
})


api

export {
    builder,
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