import Router from "@koa/router";
import { EMPTY_ROUTE, EMPTY_ROUTE_WITH_ID } from "../consts";
import { getLastVisits, getVisitsByUrl } from "../services/visits";

const visitsRouter = new Router();

visitsRouter
  .get(EMPTY_ROUTE, async (ctx) => {
    ctx.response.body = await getLastVisits(
      ctx.state.user_id,
      Number(ctx.query.limit),
      Number(ctx.query.offset)
    );
  })
  .get(EMPTY_ROUTE_WITH_ID, async (ctx) => {
    ctx.response.body = await getVisitsByUrl(
      ctx.params.id,
      ctx.state.user_id,
      Number(ctx.query.limit),
      Number(ctx.query.offset)
    );
  });

export default visitsRouter;
