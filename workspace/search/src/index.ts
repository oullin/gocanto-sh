import { App } from "#search/app";
import type { Env } from "#search/types";

export default {
    fetch: (request, env) => new App(env).handle(request),
} satisfies ExportedHandler<Env>;
