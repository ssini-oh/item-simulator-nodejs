import { Router } from 'express';
import bcrypt from 'bcrypt';

import { prisma } from '../utils/prisma/index.js';
import { generateToken } from '../utils/token.js';
import { createdIdSchema } from '../validations/auth.validation.js';

const router = Router();

//---- 회원가입 API
router.post('/signup', async (req, res, next) => {
  try {
    const validation = await createdIdSchema.validateAsync(req.body);
    const { name, userId, password, confirmPassword } = validation;

    // userId 중복 확인
    const existingUser = await prisma.user.findUnique({ where: { userId } });
    if (existingUser) {
      return res
        .status(400)
        .json({ errorMessage: '이미 존재하는 아이디입니다.' });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        userId,
        password: hashedPassword,
        name,
      },
    });

    res.status(201).json({ message: '회원가입이 완료되었습니다.' });
  } catch (error) {
    next(error);
  }
});

//---- 로그인 API
router.post('/login', async (req, res, next) => {
  const { userId, password } = req.body;

  try {
    // userId로 사용자 조회
    const user = await prisma.user.findUnique({ where: { userId } });

    if (!user) {
      return res
        .status(401)
        .json({ errorMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 비밀번호 검증
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ errorMessage: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // JWT 토큰 생성
    const token = generateToken(user);

    res.status(200).json({ message: '로그인에 성공하였습니다.', token });
  } catch (error) {
    next(error);
  }
});

export default router;
