// src/validations/item.validation.js
import Joi from 'joi';

// 아이템 생성 및 수정 시 공통 스키마
const statsSchema = Joi.object({
  health: Joi.number().integer().min(0).optional().messages({
    'number.base': '아이템의 체력 스탯은 숫자여야 합니다.',
    'number.integer': '아이템의 체력 스탯은 정수여야 합니다.',
    'number.min': '아이템의 체력 스탯은 0 이상이어야 합니다.',
  }),
  power: Joi.number().integer().min(0).optional().messages({
    'number.base': '아이템의 공격력은 숫자여야 합니다.',
    'number.integer': '아이템의 공격력은 정수여야 합니다.',
    'number.min': '아이템의 공격력은 0 이상이어야 합니다.',
  }),
}).custom((value, helpers) => {
  // 둘 중 하나는 반드시 존재해야 함
  if (value.health == null && value.power == null) {
    return helpers.message(
      'stats는 health 또는 power 중 하나 이상을 포함해야 합니다.'
    );
  }
  return value; // 유효한 경우 반환
});

// 아이템 생성 스키마
export const itemCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': '아이템명은 문자열이어야 합니다.',
    'string.empty': '아이템명은 필수 값입니다.',
    'any.required': '아이템명은 필수 값입니다.',
  }),
  type: Joi.string().required().messages({
    'string.empty': '타입은 필수 값입니다.',
    'any.required': '타입은 필수 값입니다.',
  }),
  price: Joi.number().integer().min(0).required().messages({
    'number.base': '가격은 숫자로 구성되어야 합니다.',
    'number.integer': '가격은 정수여야 합니다.',
    'number.min': '가격은 0 이상이어야 합니다.',
    'any.required': '가격은 필수 값입니다.',
  }),
  stats: statsSchema.required(),
});

// 아이템 수정 스키마
export const itemUpdateSchema = Joi.object({
  name: Joi.string().optional().messages({
    'string.base': '아이템명은 문자열이어야 합니다.',
  }),
  stats: statsSchema.optional(),
});
