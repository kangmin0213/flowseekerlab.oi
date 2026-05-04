# flowseekerlab.io

**개인 블로그용** 사이트입니다. 같은 웹 앱에서 **공개**(`/`·`/blog` 등)와 **관리자**(`/admin` 이하)가 나뉩니다. 글·설정은 **PocketBase 한곳**에 두고, 관리자에서 저장한 내용이 공개 페이지에 반영되는 것이 목표입니다. 모노레포: 웹(`apps/web`), API(`apps/api`), PocketBase(`apps/pocketbase`). 프로덕션은 Hostinger 등 정적 호스팅 + 동일 출처 PB 프록시를 전제로 합니다.

- 에이전트(Claude Code 등)에게 넘길 때는 루트 **`CLAUDE.md`** (공개/관리자 요구, 현재 공백, 보안)를 먼저 읽히면 좋습니다.
- **GitHub에는** `.env`, PocketBase 로컬 DB(`pb_data/*.db`), 실행 파일, 비밀 키가 올라가지 않도록 `.gitignore`로 막습니다. 커밋 전 `git status`로 한 번 더 확인하세요.

## 요구 사항

- **Node.js** 22.x (GitHub Actions와 동일)
- **npm** (`package-lock.json` 기준)

## 처음 클론한 뒤

```bash
npm install
npm run bootstrap
npm run setup
```

1. **`npm run bootstrap`** (루트)  
   `apps/web/.env`, `apps/web/.env.production`, `apps/api/.env`가 없을 때만 `*.example`에서 복사합니다.  
2. **`npm run setup`** (루트)  
   `npm install` + PocketBase 바이너리 다운로드 (`apps/pocketbase/setup.js`).

### 환경 변수

| 파일 | 용도 |
|------|------|
| `apps/web/.env` | 로컬 Vite (`VITE_POCKETBASE_URL` 등) — `apps/web/.env.example` 참고 |
| `apps/web/.env.production` | 프로덕션 빌드 — `apps/web/.env.production.example` 참고 |
| `apps/api/.env` | Express API — `apps/api/.env.example` 참고 (`PB_SUPERUSER_*` 등) |

PocketBase 실행 파일과 `pb_data`는 Git에 올리지 않습니다 (`.gitignore`).

## 자주 쓰는 명령 (루트에서)

| 명령 | 설명 |
|------|------|
| `npm run dev` | web(3000) + api(3001) + pocketbase(8090) 동시 실행 |
| `npm run dev:web` | 프론트만 |
| `npm run dev:pb` | PocketBase만 |
| `npm run build` / `npm run build:website` | 웹 프로덕션 빌드 (`dist/`) |
| `npm run lint` | web + api ESLint |
| `npm run ci:web` | CI와 동일: `npm ci` 후 웹 빌드 |

PocketBase 전용: `apps/pocketbase`에서 `npm run migrations:up` 등 (`package.json`의 scripts).

## 디렉터리 개요

- **`apps/web`** — Vite + React, Tailwind, PocketBase JS SDK
- **`apps/api`** — Express (CORS, 헬멧, 라우트) — PB 슈퍼유저로 관리 작업 등에 사용
- **`apps/pocketbase`** — 마이그레이션 `pb_migrations/`, 훅 `pb_hooks/`, 로컬 데이터 `pb_data/`
- **`tools/bootstrap.mjs`** — 초기 `.env` 생성만 담당

웹 빌드 전처리·RSS/사이트맵 생성은 `apps/web/tools/` 아래 스크립트를 봅니다.

## CI

`.github/workflows/verify-build.yml`: `npm ci` 후 `npm run build:website`로 웹 빌드만 검증합니다.
