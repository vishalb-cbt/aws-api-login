import * as Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(3).required(),
  password: Joi.string().min(5).required(),
});

export type Login = {
  username: string;
  password: string;
};

export function validateLoginSchema(LoginCredentials: Login) {
  const result = loginSchema.validate(LoginCredentials);
  return result;
}
