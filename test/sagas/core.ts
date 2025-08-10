import EventEmitter from "events";

import SagaBuilder from "../../src/SagaBuilder";

import { createBookingSaga } from "./createBooking";
import { createResourceSaga } from "./createResource";


const emitter = new EventEmitter();

export const builder = new SagaBuilder(emitter);

// TODO: this should return a typed object that defines the possible routes that can be called on a saga.
// We can pass this SagaRouter to the creation of other Sagas
// TODO: maybe we expose a version of this SagaRouter to the createRouter e.g.
// const sagaRouter = sagas.createRouter(router => ({ ... } )); 
// const sagaRouter = sagas.createRouter({
export const sagaRouter = builder.createRouter({
    createBooking: createBookingSaga,
    createResource: createResourceSaga
});
