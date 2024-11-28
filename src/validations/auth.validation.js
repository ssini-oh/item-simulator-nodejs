// src/validation/auth.validation.js
import Joi from 'joi';

// 회원가입(아이디 생성) 스키마
export const createdIdSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': '빈칸을 확인해주세요.',
  }),
  userId: Joi.string().pattern(new RegExp('^[a-z0-9]+$')).required().messages({
    'string.pattern.base': '아이디는 소문자와 숫자만 사용할 수 있습니다.',
    'string.empty': '빈칸을 확인해주세요.',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': '비밀번호는 최소 6자리여야 합니다.',
    'string.empty': '빈칸을 확인해주세요.',
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': '비밀번호가 일치하지 않습니다.',
    'string.empty': '빈칸을 확인해주세요.',
  }),
});
