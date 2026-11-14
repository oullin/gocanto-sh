import { Search } from "#search/search";
import { Site } from "#search/site";
import type { Env, Source } from "#search/types";

/** Routes for the writing search Worker. */
export class App {
    static readonly maxQuery = 200;

    constructor(
        private readonly env: Env,
        private readonly source: Source = new Site(env.SITE_URL),
    ) {}

    handle(request: Request): Promise<Response> {
        const { pathname } = new URL(request.url);

        if (pathname === "/api/search/query") {
            return request.method === "POST"
                ? this.query(request)
                : Promise.resolve(App.error(405, "Use POST"));
        }

        if (pathname === "/api/search/index") {
            return request.method === "POST"
                ? this.index(request)
                : Promise.resolve(App.error(405, "Use POST"));
        }

        return Promise.resolve(App.error(404, "Not found"));
    }

    private async query(request: Request): Promise<Response> {
        const body = (await request.json().catch(() => null)) as { q?: unknown } | null;

        const q = typeof body?.q === "string" ? body.q.trim() : "";

        if (!q || q.length > App.maxQuery) {
            return App.error(400, `q must be 1 to ${App.maxQuery} characters`);
        }

        return Response.json(await new Search(this.env).query(q));
    }

    private async index(request: Request): Promise<Response> {
        const token = this.env.INDEX_TOKEN;

        if (!token || request.headers.get("authorization") !== `Bearer ${token}`) {
            return App.error(401, "Unauthorised");
        }

        return Response.json({ vectors: await new Search(this.env).index(this.source) });
    }

    private static error(status: number, error: string): Response {
        return Response.json({ error }, { status });
    }
}
