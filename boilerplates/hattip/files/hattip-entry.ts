import { authjsHandler } from "@batijs/authjs/server/authjs-handler";
import { telefuncHandler } from "@batijs/telefunc/server/telefunc-handler";
import { appRouter } from "@batijs/trpc/trpc/server";
import type { HattipHandler } from "@hattip/core";
import { createRouter, type RouteHandler } from "@hattip/router";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { renderPage } from "vike/server";

function handlerAdapter<Context extends Record<string | number | symbol, unknown>>(
  handler: (request: Request, context: Context) => Promise<Response>,
): RouteHandler<unknown, unknown> {
  return (context) => {
    return handler(context.request, context as unknown as Context);
  };
}

const router = createRouter();

if (BATI.has("telefunc")) {
  /**
   * Telefunc route
   *
   * @link {@see https://telefunc.com}
   **/
  router.post("/_telefunc", handlerAdapter(telefuncHandler));
}

if (BATI.has("trpc")) {
  /**
   * tRPC route
   *
   * @link {@see https://trpc.io/docs/server/adapters/fetch}
   **/
  router.use("/api/trpc/*", (context) => {
    return fetchRequestHandler({
      router: appRouter,
      req: context.request,
      endpoint: "/api/trpc",
      createContext({ req }) {
        return { req };
      },
    });
  });
}

if (BATI.has("authjs")) {
  router.use("/api/auth/*", handlerAdapter(authjsHandler));
}

/**
 * Vike route
 *
 * @link {@see https://vike.dev}
 **/
router.use(async (context) => {
  const pageContextInit = { urlOriginal: context.request.url };
  const pageContext = await renderPage(pageContextInit);
  const response = pageContext.httpResponse;

  return new Response(await response?.getBody(), {
    status: response?.statusCode,
    headers: response?.headers,
  });
});

export default router.buildHandler() as HattipHandler;
