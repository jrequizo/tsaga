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
import SagaBuilder from "./SagaBuilder";


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

const emitter = new EventEmitter();
const builder = new SagaBuilder(emitter);

const createBookingSaga = builder.createSaga({
    schema: z.object({
        flightId: z.string(),
    }),
    // TODO: we can't really expose router here as it's return type is defined in the 'createRouter' 
    // function and we don't store a ref of what that is internally that is passed around.
    // We only mutate and force the type inference of SagaBuilder when we can explicitly
    // define the return type in a function and pass the new reference of it around.
    emit: ({ input, router }) => {
        builder.callers.createFlightItinerary.emit({ input: "" });

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
const sagaRouter = builder.createRouter({
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