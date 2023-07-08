import Router from "@koa/router";
import {
  createShortUrl,
  deleteUrl,
  getUrls,
  updateUrl,
} from "../services/urls";
import { CreateUrlBody, UpdateUrlBody } from "../types";
import { EMPTY_ROUTE, EMPTY_ROUTE_WITH_ID } from "../consts";

const urlsRouter = new Router();

urlsRouter
  .get(EMPTY_ROUTE, async (ctx) => {
    ctx.response.body = await getUrls(
      ctx.state.user_id,
      Number(ctx.request.query.limit),
      Number(ctx.request.query.offset)
    );
  })
  .post(EMPTY_ROUTE, async (ctx) => {
    ctx.response.body = await createShortUrl(
      ctx.request.body as CreateUrlBody,
      ctx.state.user_id
    );
  })
  .put(EMPTY_ROUTE_WITH_ID, async (ctx) => {
    ctx.response.body = await updateUrl(
      ctx.params.id,
      ctx.request.body as UpdateUrlBody,
      ctx.state.user_id
    );
  })
  .delete(EMPTY_ROUTE_WITH_ID, async (ctx) => {
    ctx.response.body = await deleteUrl(ctx.params.id, ctx.state.user_id);
  });

export default urlsRouter;
