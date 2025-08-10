import z from "zod/v4";
import { builder, sagaRouter } from "./core";


export const createResourceSaga = builder.createSaga({
    schema: z.object({
        resourceId: z.string(),
    }),
    emit: ({ input }) => {

        // ... call AWS
        // .. insert to DB
    }
});