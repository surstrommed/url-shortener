import knex from "../config/knex";
import HttpError from "http-errors";
import {
  ACCESS_DENIED,
  REQUEST_DEFAULT_LIMIT,
  REQUEST_DEFAULT_OFFSET,
  URL_NOT_FOUND,
} from "../consts";

export const registerVisit = async (url_id: string, ip: string) =>
  knex("visits").insert({ url_id, ip });

export const getLastVisits = async (
  user_id: number,
  limit = REQUEST_DEFAULT_LIMIT,
  offset = REQUEST_DEFAULT_OFFSET
) =>
  await knex("visits")
    .join("urls", "urls.id", "visits.url_id")
    .select(["urls.id", "urls.url", "visits.ip", "visits.created_at"])
    .where({ user_id })
    .limit(limit)
    .offset(offset)
    .orderBy("visits.created_at", "desc");

export const getVisitsByUrl = async (
  url_id: string,
  user_id: number,
  limit = REQUEST_DEFAULT_LIMIT,
  offset = REQUEST_DEFAULT_OFFSET
) => {
  const url = await knex("urls")
    .where({ id: url_id })
    .select(["user_id"])
    .first();
  if (!url) {
    throw new HttpError.NotFound(URL_NOT_FOUND);
  }
  if (url.user_id !== user_id) {
    throw new HttpError.Unauthorized(ACCESS_DENIED);
  }

  return await knex("visits")
    .where({ url_id })
    .limit(limit)
    .offset(offset)
    .orderBy("created_at", "desc");
};
