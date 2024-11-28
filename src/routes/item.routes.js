import { Router } from 'express';
import { prisma } from '../utils/prisma/index.js';

import Joi from 'joi';

const router = Router();

const itemSchema = Joi.object({
  // 아이템 이름 (필수)
  name: Joi.string().required().messages({
    'string.empty': '아이템명은 필수 값입니다.',
    'any.required': '아이템명은 필수 값입니다.',
  }),

  // 아이템 타입 (필수)
  type: Joi.string().required().messages({
    'string.empty': '타입은 필수 값입니다',
    'any.required': '타입은 필수 값입니다.',
  }),

  // 아이템 가격 (양의 정수, 필수)
  price: Joi.number().integer().min(0).required().messages({
    'number.base': '가격은 숫자로 구성되어야 합니다.',
    'number.integer': '가격은 정수여야 합니다.',
    'number.min': '가격은 0 이상이어야 합니다.',
    'any.required': '가격은 필수 값입니다.',
  }),

  // 아이템 스탯 (JSON, 필수)
  stats: Joi.object({
    // 체력 (양의 정수, 필수)
    health: Joi.number().integer().min(0).required().messages({
      'number.base': '아이템의 체력 스탯은 숫자여야 합니다.',
      'number.integer': '아이템의 체력 스탯은 정수여야 합니다.',
      'number.min': '아이템의 체력 스탯은 0 이상이어야 합니다.',
      'any.required': '아이템의 체력 스탯은 필수 값입니다.',
    }),

    // 공격력 (양의 정수, 필수)
    power: Joi.number().integer().min(0).required().messages({
      'number.base': '아이템의 공격력은 숫자여야 합니다.',
      'number.integer': '아이템의 공격력은 정수여야 합니다.',
      'number.min': '아이템의 공격력은 0 이상이어야 합니다.',
      'any.required': '아이템의 공격력은 필수 값입니다.',
    }),
  }).required(),
});

//---- 아이템 생성 API
router.post('/items', async (req, res, next) => {
  try {
    const validation = await itemSchema.validateAsync(req.body);
    const { name, type, price, stats } = validation;

    // 아이템명 중복 확인
    const existingItem = await prisma.item.findUnique({ where: { name } });
    if (existingItem) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 아이템명입니다.' });
    }

    // 아이템 데이터 생성
    const item = await prisma.item.create({
      data: {
        name,
        type,
        price,
        stats,
      },
    });

    // 응답 반환
    return res.status(201).json({ message: '아이템이 생성되었습니다.' });
  } catch (error) {
    next(error);
  }
});

//---- 아이템 수정 API
router.put('/items/:idx', async (req, res, next) => {});

//---- 아이템 전체 조회 API
router.get('/items', async (req, res, next) => {});

//---- 아이템 상세 조회 API
router.get('/items/:idx', async (req, res, next) => {});

export default router;
