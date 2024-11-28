import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Authorization 헤더가 없을 때
  if (!authHeader) {
    console.error('Authorization 헤더가 없습니다.');
    return res
      .status(401)
      .json({ errorMessage: '올바르지 않은 인증 요청입니다.' });
  }

  const token = authHeader.split(' ')[1];

  // 토큰이 없을 때
  if (!token) {
    console.error('토큰이 없습니다.');
    return res
      .status(401)
      .json({ errorMessage: '올바르지 않은 인증 요청입니다.' });
  }

  try {
    // 토큰 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 인증된 사용자 정보를 req.locals에 저장
    req.locals = req.locals || {};
    req.locals.user = decoded;

    // 다음 미들웨어로 이동
    next();
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
