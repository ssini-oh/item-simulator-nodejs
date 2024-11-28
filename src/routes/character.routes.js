import { Router } from 'express';
import { prisma } from '../utils/prisma/index.js';

import authMiddleware from '../middlewares/auth.middleware.js';

const router = Router();

//---- 캐릭터 생성 API
router.post('/characters', authMiddleware, async (req, res, next) => {
  const { nickname } = req.body;
  const { userId } = req.locals.user;

  try {
    // 닉네임 중복 확인
    const existingNickname = await prisma.character.findUnique({
      where: { nickname },
    });
    if (existingNickname) {
      return res.status(400).json({
        errorMessage: '이미 사용 중인 닉네임입니다.',
      });
    }

    // 유저 확인
    const user = await prisma.user.findUnique({ where: { userId } });
    if (!user) {
      return res.status(400).json({
        errorMessage: '존재하지 않는 사용자입니다.',
      });
    }

    // 캐릭터 생성
    const newCharacter = await prisma.character.create({
      data: {
        nickname,
        userIdx: user.idx, // 인증된 사용자의 idx를 외래키로 사용
      },
    });

    res
      .status(201)
      .json({ message: '캐릭터 생성에 성공했습니다.', newCharacter });
  } catch (error) {
    next(error);
  }
});

//---- 캐릭터 조회 API
router.get('/characters/:nickname', async (req, res, next) => {
  const { nickname } = req.params;
  console.log(nickname); // 한글 닉네임 확인

  try {
    const character = await prisma.character.findUnique({
      where: { nickname },
    });

    if (!character) {
      return res
        .status(404)
        .json({ errorMessage: '해당 캐릭터를 찾을 수 없습니다.' });
    }

    return res.status(200).json(character);
  } catch (error) {
    next(error);
  }
});

//---- 캐릭터 삭제 API
router.delete(
  '/characters/:nickname',
  authMiddleware,
  async (req, res, next) => {
    const { nickname } = req.params;

    try {
      const character = await prisma.character.findUnique({
        where: { nickname },
      });

      if (!character) {
        return res
          .status(404)
          .json({ errorMessage: '해당 캐릭터를 찾을 수 없습니다.' });
      }

      await prisma.character.delete({ where: { nickname } });

      res.status(200).json({ message: '캐릭터가 삭제되었습니다.' });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
