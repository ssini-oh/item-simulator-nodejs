# Item Simulator Node.js

## 목차

1. [프로젝트 소개](#프로젝트-소개)
2. [주요 기능](#주요-기능)
   - [사용자 인증](#사용자-인증)
   - [캐릭터 관리](#캐릭터-관리)
   - [아이템 관리](#아이템-관리)
   - [데이터베이스 모델링](#데이터베이스-모델링)
   - [에러 처리](#에러-처리)
3. [설치 및 실행 방법](#설치-및-실행-방법)
   - [1. 클론 및 의존성 설치](#1-클론-및-의존성-설치)
   - [2. 환경 변수 설정](#2-환경-변수-설정)
   - [3. 데이터베이스 초기화](#3-데이터베이스-초기화)
   - [4. 서버 실행](#4-서버-실행)
4. [폴더 구조](#폴더-구조)
5. [기술 스택](#기술-스택)
6. [기타](#기타)

## 프로젝트 소개

**Item Simulator Node.js**는 사용자 인증, 캐릭터 관리, 아이템 CRUD 기능을 제공하는 Node.js 기반 백엔드 프로젝트입니다.

- 이 프로젝트는 AWS RDS와 Prisma ORM을 사용하여 데이터베이스와 연동되며, Express 프레임워크와 JWT 인증을 통해 보안이 강화된 API를 제공합니다.

## 주요 기능

### 사용자 인증

- **회원가입 및 로그인 API**:
  - 회원가입 시 bcrypt를 사용하여 비밀번호를 해싱합니다.
  - 로그인 시 JWT 토큰을 발급합니다.
- **JWT 인증 미들웨어**:
  - 토큰의 유효성을 검사하고 사용자 정보를 인증합니다.
  - 인증에 성공하면 요청 객체에 사용자 정보를 저장합니다.

### 캐릭터 관리

- **캐릭터 생성, 조회, 삭제 API**:
  - 유저와 1\:N 관계를 가지는 캐릭터 테이블을 설계했습니다.
  - Prisma를 사용하여 데이터베이스와 동기화합니다.

### 아이템 관리

- **아이템 CRUD API**:
  - 아이템 생성, 수정, 목록 조회, 상세 조회 기능을 구현했습니다.
  - 아이템의 속성(stats, 예: 체력, 공격력 등)은 JSON 형태로 저장됩니다.
- **입력 검증**:
  - Joi를 사용하여 API 요청 데이터의 유효성을 검증합니다.
  - 가격, 이름, 스탯 필드에 대한 상세 조건을 설정합니다.

### 데이터베이스 모델링

- **Prisma ORM**:
  - 다음과 같은 테이블 설계 및 관계를 정의했습니다:
    - **User**: 사용자 정보 저장.
    - **Character**: 사용자와 1\:N 관계의 캐릭터.
    - **Item**: 아이템 정보를 저장.
    - **Character_Inventory**: 캐릭터 인벤토리 (캐릭터와 아이템 간 N\:N 관계).
    - **Character_Item**: 캐릭터가 장착한 아이템 정보 (캐릭터와 아이템 간 N\:N 관계).

### 에러 처리

- **통합 에러 핸들링 미들웨어**:
  - API 요청에서 발생하는 오류를 일관된 형태로 클라이언트에 반환합니다.
  - 인증 실패, 유효하지 않은 입력 등 다양한 오류 상황을 처리합니다.

## 설치 및 실행 방법

### 1. 클론 및 의존성 설치

```bash
git clone https://github.com/ssini-oh/item-simulator-nodejs.git
cd item-simulator-nodejs

yarn install
```

### 2. 환경 변수 설정

`.env` 파일을 생성하고 다음 내용을 추가하세요:

```
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=your_jwt_secret

PORT=3000
```

### 3. 데이터베이스 초기화

Prisma를 사용해 프로젝트를 초기화합니다.

```bash
npx prisma init
```

### 4. 서버 실행

```bash
yarn dev
```

- 서버가 `http://localhost:3000`에서 실행됩니다.

## 폴더 구조

```
src/
├── middlewares/            # 인증 및 에러 핸들링 미들웨어
├── routes/                 # API 라우트 파일
│   ├── auth.routes.js      # 사용자 인증 관련 API
│   ├── character.routes.js # 캐릭터 관련 API
│   └── item.routes.js      # 아이템 관련 API
├── utils/                  # 유틸리티 함수 및 Prisma 설정
├── validations/            # 유효성 검사 관련 파일
└── app.js                  # Express 서버 설정
```

## 기술 스택

- **언어 및 런타임**: Node.js
- **웹 프레임워크**: Express
- **ORM**: Prisma
- **인증**: JSON Web Token (JWT)
- **데이터베이스**: MySQL (AWS RDS)
- **유효성 검사**: Joi
- **비밀번호 해싱**: Bcrypt
- **개발 도구**: Nodemon, Prettier

## 기타

<details>
<summary>암호화 방식</summary>

- 비밀번호를 저장할 때 Hash를 사용했는데, Hash는 단방향 암호화에 해당합니다. 단방향 암호화는 한 번 암호화하면 다시 복원할 수 없기 때문에 비밀번호 보관에 적합합니다.

- 비밀번호가 그대로 저장되면 해킹 시 쉽게 탈취당할 수 있지만, 해시된 비밀번호는 복원하기 어려워 데이터 유출 시에도 사용자 정보를 안전하게 보호할 수 있습니다.
</details>

<details>
<summary>인증 방식</summary>

- JWT를 사용해 인증을 하는데, 만약 Access Token이 노출되면 공격자가 이 토큰을 사용해 사용자의 권한으로 서버에 접근할 수 있습니다.

- 이를 방지하려면 Access Token의 만료 시간을 짧게 설정하고, Refresh Token을 사용해 새로운 Access Token을 발급받는 방식으로 보완할 수 있습니다. 또한, HTTPS를 사용해 전송 중 토큰이 노출되지 않도록 해야 합니다.
</details>

<details>
<summary>인증과 인가</summary>

- **인증**은 사용자가 누구인지 확인하는 과정입니다. 예를 들어 로그인 시 아이디와 비밀번호를 확인하는 것이 인증입니다.
- **인가**는 인증된 사용자가 어떤 권한을 가지고 있는지 결정하는 과정입니다. 예를 들어, 관리자가 아닌 사용자가 관리자 페이지에 접근하지 못하게 하는 것이 인가입니다.
- 인증이 필요한 API는 서비스에 문제를 야기할 수 있습니다. 아이템 생성이나 수정은 게임 경제에 영향을 주기 때문에 인증이 필요합니다.
</details>

<details>
<summary>Http Status Code</summary>

- **200 OK**: 요청이 성공적으로 처리되었음을 나타냅니다. (예: 로그인, 데이터 조회 성공)
- **201 Created**: 요청이 성공적으로 처리되어 새로운 리소스가 생성되었음을 나타냅니다. (예: 회원가입, 아이템 생성)
- **400 Bad Request**: 클라이언트 요청이 잘못되었거나 유효하지 않은 데이터를 포함할 때 사용합니다. (예: Joi 유효성 검사 실패, 필수 필드 누락)
- **401 Unauthorized**: 인증이 필요한 요청에 유효한 인증 자격 증명이 제공되지 않을 때 사용합니다. (예: 로그인되지 않거나 잘못된 JWT 토큰 사용)

- **500 Internal Server Error**: 서버 내부에서 예기치 않은 에러가 발생할 때 사용합니다. (예: 코드 로직 에러 등)

</details>

<details>
<summary>게임 경제</summary>

- 유연성 부족: 게임 머니와 관련된 거래 기록(수입, 지출)을 추적하거나 다양한 종류의 재화를 관리하기 어렵게 됩니다.

- 아이템 가격을 클라이언트에서 입력하게 하면 사용자가 임의로 가격을 조작할 수 있습니다. 이를 막기 위해 가격 정보는 서버에서 관리하고 클라이언트는 가격을 표시만 하도록 해야 합니다.
</details>
