import z from "zod/v4";
import { createSaga } from "../../src/createSaga";


export const createResourceSaga = createSaga({
    schema: z.object({
        resourceId: z.string(),
    }),
    emit: ({ input }) => {

        // ... call AWS
        // .. insert to DB
    }
});