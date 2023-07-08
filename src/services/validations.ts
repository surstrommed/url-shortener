import Validator from "validatorjs";
import HttpError from "http-errors";

const validateBody = <ValidateBody>(
  body: ValidateBody,
  validation_schema: Validator.Rules
) => {
  const validation = new Validator(body, validation_schema);
  if (validation.fails()) {
    const errors = validation.errors.all();
    const formattedErrors: string[] = [];
    Object.keys(errors).forEach((key) => {
      formattedErrors.push(validation.errors.first(key) as string);
    });
    throw new HttpError.BadRequest(formattedErrors.join(" & "));
  } else {
    return true;
  }
};

export const validateCreateUrl = <ValidateBody>(body: ValidateBody) =>
  validateBody(body, {
    url: "url|required",
    id: "string|min:5|max:10|not_in:urls,visits,auth",
  });

export const validateUpdateUrl = <ValidateBody>(body: ValidateBody) =>
  validateBody(body, {
    url: "url|required",
  });

export const validateRegister = <ValidateBody>(body: ValidateBody) =>
  validateBody(body, {
    username: "string|required|min:4|max:8",
    password: "string|required|min:6",
  });

export const validateLogin = <ValidateBody>(body: ValidateBody) =>
  validateBody(body, {
    username: "string|required",
    password: "string|required",
  });
