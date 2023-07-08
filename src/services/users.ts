import knex from "../config/knex";
import { validateLogin, validateRegister } from "./validations";
import HttpError from "http-errors";
import { comparePassword, hashPassword } from "../config/encryption";
import { USERNAME_PASSWORD_INCORRECT, USER_EXISTS } from "../consts";
import { generateJWT } from "../config/jwt";
import { AuthBody } from "../types";

export const getUser = async (username: string) =>
  knex("users").whereRaw("LOWER(username) = LOWER(?)", [username]).first();

export const register = async (body: AuthBody) => {
  validateRegister(body);
  const current_user = await getUser(body.username);
  if (current_user) {
    throw new HttpError.Conflict(USER_EXISTS);
  }

  return (
    await knex("users").insert(
      {
        username: body.username.toLocaleLowerCase(),
        password: await hashPassword(body.password),
      },
      ["id", "username"]
    )
  )[0];
};

export const login = async (body: AuthBody) => {
  validateLogin(body);
  const user = await getUser(body.username);
  if (!user) {
    throw new HttpError.NotFound(USERNAME_PASSWORD_INCORRECT);
  }
  const passwordMatch = await comparePassword(body.password, user.password);
  if (!passwordMatch) {
    throw new HttpError.Unauthorized(USERNAME_PASSWORD_INCORRECT);
  }
  const token = generateJWT({ id: user.id });
  return {
    user: {
      id: user.id,
      username: user.username,
      created_at: user.created_at,
      updated_at: user.updated_at,
    },
    token,
  };
};
