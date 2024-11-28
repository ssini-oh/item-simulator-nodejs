import express from 'express';

import errorHandlerMiddleware from './middlewares/error-handler.middleware.js';

import authRoutes from './routes/auth.routes.js';
import characterRoutes from './routes/character.routes.js';
import itemRoutes from './routes/item.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API 라우트
app.use('/api', [authRoutes, characterRoutes, itemRoutes]);

// 에러 처리 미들웨어
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(PORT, '포트로 서버가 열렸어요!');
});
