import {
  AUTH_ROUTE,
  EMPTY_ROUTE_WITH_ID,
  URLS_ROUTE,
  VISITS_ROUTE,
} from "../consts";
import Router from "@koa/router";
import authRouter from "./auth";
import urlsRouter from "./urls";
import visitsRouter from "./visits";
import { authRequired } from "./middlewares";
import { resolveUrl } from "../services/urls";

const router = new Router();

router.use(AUTH_ROUTE, authRouter.routes(), authRouter.allowedMethods());
router.use(
  URLS_ROUTE,
  authRequired,
  urlsRouter.routes(),
  urlsRouter.allowedMethods()
);
router.use(
  VISITS_ROUTE,
  authRequired,
  visitsRouter.routes(),
  visitsRouter.allowedMethods()
);

router.get(EMPTY_ROUTE_WITH_ID, async (ctx) => {
  const url = await resolveUrl(ctx.params.id, ctx.request.ip);
  ctx.redirect(url);
});

export default router;
