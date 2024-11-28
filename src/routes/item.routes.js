import { Router } from 'express';
import { prisma } from '../utils/prisma/index.js';
import {
  itemCreateSchema,
  itemUpdateSchema,
} from '../validations/item.validation.js';

const router = Router();

//---- 아이템 생성 API
router.post('/items', async (req, res, next) => {
  try {
    const validation = await itemCreateSchema.validateAsync(req.body);
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
