import jwt from "jsonwebtoken";
import HttpError from "http-errors";
import { PROVIDE_VALID_TOKEN, TOKEN_EXPIRATION } from "../consts";
import { JwtPayloadBody } from "../types";

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY as string;

export const generateJWT = (payload: {
  [key: string]: string | number | boolean;
}) => jwt.sign(payload, JWT_PRIVATE_KEY, { expiresIn: TOKEN_EXPIRATION });

export const validateJWT = (token: string) => {
  try {
    return jwt.verify(token, JWT_PRIVATE_KEY) as JwtPayloadBody;
  } catch (error) {
    throw new HttpError.Unauthorized(PROVIDE_VALID_TOKEN);
  }
};
