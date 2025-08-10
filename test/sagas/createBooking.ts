import z from "zod/v4";
import { sagaRouter } from "./core";
import { createSaga } from "../../src/createSaga";


export const createBookingSaga = createSaga({
    schema: z.object({
        flightId: z.string(),
    }),
    emit: ({ input }) => {

        // ... call AWS
        // .. insert to DB
        console.log(input.flightId);

        sagaRouter.createResource.emit({ input: { resourceId: "123" } });
    }
});