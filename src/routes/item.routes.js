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
router.patch('/items/:idx', async (req, res, next) => {
  const { idx } = req.params;

  try {
    // 데이터 유효성 검사
    const validation = await itemUpdateSchema.validateAsync(req.body);
    const { name, stats } = validation;

    // 아이템 존재 여부 확인
    const existingItem = await prisma.item.findUnique({
      where: { idx: Number(idx) },
    });
    if (!existingItem) {
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 아이템입니다.' });
    }

    // 수정 불가능한 필드 확인
    if (req.body.type || req.body.price) {
      return res
        .status(400)
        .json({ errorMessage: '가격 및 타입은 수정할 수 없습니다.' });
    }

    // 아이템 업데이트
    const updatedItem = await prisma.item.update({
      where: { idx: Number(idx) },
      data: validation,
    });

    // 응답 반환
    return res.status(200).json({ message: '아이템 수정이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
});

//---- 아이템 전체 조회 API
router.get('/items', async (req, res, next) => {
  try {
    // 아이템 전체 조회
    const items = await prisma.item.findMany({
      select: {
        idx: true,
        price: true,
        name: true,
      },
      orderBy: {
        idx: 'asc',
      },
    });

    // 응답 반환
    return res.status(200).json(items);
  } catch (error) {
    next(error);
  }
});

//---- 아이템 상세 조회 API
router.get('/items/:idx', async (req, res, next) => {
  const { idx } = req.params;

  try {
    // 아이템 상세 조회
    const item = await prisma.item.findUnique({
      where: { idx: Number(idx) },
    });

    // 아이템 존재 여부 확인
    if (!item) {
      return res
        .status(404)
        .json({ errorMessage: '존재하지 않는 아이템입니다.' });
    }

    // 응답 반환
    return res.status(200).json(item);
  } catch (error) {
    next(error);
  }
});

export default router;
