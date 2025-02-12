import { type Context } from './context';
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

export const t = initTRPC.context<Context>().create();

const protectedProcedure = t.procedure;

const FOLDER_PATH_REGEX = /^(\/|([a-zA-Z]:)?(\\|\/))([^<>:"|?*]+(\\|\/)?)*[^<>:"|?*\s\\\/]$/;
const RELATIVE_FILE_PATH_REGEX = /^(?:\.{0,2}\/)?[\w\-. /\\]+\.[a-zA-Z0-9]+$/;

export const appRouter = t.router({
    rigve_current_file:
        protectedProcedure
            .input(z.object({
                prj_path: z.string().regex(FOLDER_PATH_REGEX),
                file_path: z.string().regex(RELATIVE_FILE_PATH_REGEX)
            }))
            .mutation(async ({ input, ctx }) => {
                return { success: true };
            }),

    health:
        protectedProcedure
            .query(() => {
                return { success: true, message: "healthy" };
            }),

    rigve_ns_diagram:
        protectedProcedure
            .input(z.object({
                file_path: z.string().regex(RELATIVE_FILE_PATH_REGEX),
                fn_name: z.string(),
                source_code: z.string(),
                start_byte: z.number(),
                end_byte: z.number(),
            }))
            .query(async ({ input, ctx }) => {
                    return { success: false, nodes: [], edges: [] };
            }),
});

export type AppRouter = typeof appRouter;