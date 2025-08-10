# TSaga

Type-safe wrapper for event emitters built for implementing choreographed Sagas.

## Example
1. Create your Sagas
```ts
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

export const createResourceSaga = createSaga({
    schema: z.object({
        resourceId: z.string(),
    }),
    emit: ({ input }) => {

        // ... call AWS
        // .. insert to DB
    }
});
```
2. Create your Saga Router
```ts
export const sagaRouter = createRouter(emitter, {
    createBooking: createBookingSaga,
    createResource: createResourceSaga
});
```
3. Call your Sagas
```ts
sagaRouter.createBooking.emit({ input: { flightId: "123" } });
```


## TODOs
- [ ] Add tests
- [ ] Context support e.g. passing ongoing database transaction
- [ ] First-class support for zod@v4
- [ ] Managed state for result collection and aggregation e.g. run a query at the completion of a set of Sagas
- [ ] Support for cancellation of Sagas