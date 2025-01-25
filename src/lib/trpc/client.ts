import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import { AppRouter } from './router';


const PORT = 8129;
const BASE_URL = `http://localhost:${PORT}`;
const TRPC_BASE_URL = `${BASE_URL}/trpc`;

// Pass AppRouter as generic here. 👇 This lets the `trpc` object know
// what procedures are available on the server and their input/output types.
export const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: TRPC_BASE_URL,
        }),
    ],
});