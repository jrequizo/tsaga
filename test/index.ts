/**
 * Unanswered technical questions:
 * [ ] Why do we need the TOutput for the Saga
 * [ ] Make sure this has complete parity for zod@v4
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



// TODO: Need a factory for this so we can pass the same instance of EventEmitter()
// This factory will be whats used in the SagaRouter class
// TODO: does each saga need a unique name?
// const array of names for the saga?

// // type SagaRouter = typeof sagaRouter;
// sagaRouter.routes.createBooking.emit({ input: { flightId: "123" } });

// sagaRouter.routes.createBooking.emit("")


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