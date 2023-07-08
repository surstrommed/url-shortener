import knex from "../config/knex";
import { validateCreateUrl, validateUpdateUrl } from "./validations";
import HttpError from "http-errors";
import { registerVisit } from "./visits";
import {
  ACCESS_DENIED,
  ID_EXISTS,
  REQUEST_DEFAULT_LIMIT,
  REQUEST_DEFAULT_OFFSET,
  URL_NOT_FOUND,
} from "../consts";
import { CreateUrlBody, UpdateUrlBody } from "../types";

export const createShortUrl = async (body: CreateUrlBody, user_id: number) => {
  validateCreateUrl(body);

  if (body.id) {
    const current_record = await knex("urls").where({ id: body.id }).first();
    if (current_record) {
      throw new HttpError.Conflict(ID_EXISTS);
    }
  }

  const results = await knex("urls").insert(
    { url: body.url, id: body.id, user_id },
    "*"
  );
  return results[0];
};

export const resolveUrl = async (id: string, ip: string) => {
  const result = await knex("urls").where({ id }).select(["url"]).first();
  if (!result) {
    throw new HttpError.NotFound(URL_NOT_FOUND);
  }
  await registerVisit(id, ip);
  return result.url;
};

export const updateUrl = async (
  id: string,
  body: UpdateUrlBody,
  user_id: number
) => {
  validateUpdateUrl(body);

  const url = await knex("urls").where({ id }).select(["user_id"]).first();
  if (!url) {
    throw new HttpError.NotFound(URL_NOT_FOUND);
  }
  if (url.user_id !== user_id) {
    throw new HttpError.Unauthorized(ACCESS_DENIED);
  }

  const result = await knex("urls")
    .where({ id })
    .update({ url: body.url }, "*");
  return result[0];
};

export const deleteUrl = async (id: string, user_id: number) => {
  const url = await knex("urls").where({ id }).select(["user_id"]).first();
  if (!url) {
    throw new HttpError.NotFound(URL_NOT_FOUND);
  }
  if (url.user_id !== user_id) {
    throw new HttpError.Unauthorized(ACCESS_DENIED);
  }

  await knex("urls").where({ id }).delete();
  return true;
};

export const getUrls = async (
  user_id: number,
  limit = REQUEST_DEFAULT_LIMIT,
  offset = REQUEST_DEFAULT_OFFSET
) =>
  await knex("urls")
    .where({ user_id })
    .leftJoin("visits", "urls.id", "visits.url_id")
    .select([
      "urls.id",
      "urls.url",
      "urls.created_at",
      knex.raw("count(visits.id) as visits_count"),
    ])
    .limit(limit)
    .offset(offset)
    .groupBy("urls.id")
    .orderBy("urls.created_at", "desc");
