import { RouterContext } from "@koa/router";
import { Next } from "koa";
import HttpError from "http-errors";
import { AUTHORIZATION_REQUIRED } from "../consts";
import { validateJWT } from "../config/jwt";

export const authRequired = async (ctx: RouterContext, next: Next) => {
  const authHeader = ctx.request.headers.authorization;
  if (!authHeader) {
    throw new HttpError.Unauthorized(AUTHORIZATION_REQUIRED);
  }
  const token = authHeader.split(" ")[1];
  const tokenPayload = validateJWT(token);
  ctx.state.user_id = tokenPayload.id;
  await next();
};
