import z from "zod/v4";
import { builder, sagaRouter } from "./core";


export const createBookingSaga = builder.createSaga({
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