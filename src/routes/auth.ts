import Router from "@koa/router";
import { LOGIN_ROUTE, REGISTER_ROUTE } from "../consts";
import { login, register } from "../services/users";
import { AuthBody } from "../types";

const authRouter = new Router();

authRouter
  .post(REGISTER_ROUTE, async (ctx) => {
    ctx.response.body = await register(ctx.request.body as AuthBody);
  })
  .post(LOGIN_ROUTE, async (ctx) => {
    ctx.response.body = await login(ctx.request.body as AuthBody);
  });

export default authRouter;
