"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateLoginSchema = exports.loginSchema = void 0;
var Joi = require("joi");
exports.loginSchema = Joi.object({
    username: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(5).required(),
});
function validateLoginSchema(LoginCredentials) {
    var result = exports.loginSchema.validate(LoginCredentials);
    return result;
}
exports.validateLoginSchema = validateLoginSchema;
//# sourceMappingURL=Login.js.map