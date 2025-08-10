import EventEmitter from "events";

import { createRouter } from "../../src/createRouter";

import { createBookingSaga } from "./createBooking";
import { createResourceSaga } from "./createResource";


const emitter = new EventEmitter();

export const sagaRouter = createRouter(emitter, {
    createBooking: createBookingSaga,
    createResource: createResourceSaga
});

// Example of how we would call this to trigger a Saga:
// sagaRouter.createBooking.emit({ input: { flightId: "123" } });