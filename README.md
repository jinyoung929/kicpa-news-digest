# CPA뉴스 데일리 다이제스트

평일 오전 10시(KST), [news.kicpa.or.kr](https://news.kicpa.or.kr/)에 새로 올라온 기사를 수집하고 OpenAI API로 요약해 보여주는 회계 뉴스 자동화 서비스입니다.

회계법인 지원 및 회계 이슈 모니터링 과정에서 반복적으로 수행하던 뉴스 확인 업무를 자동화하기 위해 만들었습니다. 신규 기사 선별, 본문 추출, 3문장 요약, 날짜별 데이터 저장, GitHub Actions 실행, Vercel 배포까지 이어지는 자동화 흐름을 구성했습니다.

## 화면 이미지

![Uploading 스크린샷 2026-07-01 오후 8.22.11.png…]()


## Project Context

- 프로젝트 유형: 1인 개인 프로젝트
- 핵심 방향: 반복 정보 수집 업무 자동화, 회계 이슈 모니터링 효율화
- 운영 방식: 정기 실행 기반 데이터 갱신 및 정적 사이트 배포

### 시스템 아키텍쳐

![Uploading 스크린샷 2026-07-02 오후 2.14.05.png…]()


## My Role

- 뉴스 수집 스크립트 구현
- 신규 기사 중복 처리 로직 설계
- OpenAI API 기반 3문장 요약 기능 구현
- 카테고리 및 취업 준비 핵심 키워드 태깅
- GitHub Actions 기반 정기 실행 자동화
- Vercel 배포 흐름 구성

## 자동화 흐름

1. CPA뉴스 목록 페이지에서 기사 수집
2. `seen.json`과 비교해 신규 기사만 선별
3. 기사 본문과 카테고리 추출
4. OpenAI API로 3문장 요약 생성
5. 날짜별 JSON 데이터 저장
6. GitHub Actions에서 결과 커밋
7. Vercel 배포 트리거

## 구조

- **웹사이트**: Next.js (App Router). `data/*.json`을 읽어 렌더링합니다.
  - `app/page.tsx` — 가장 최근 다이제스트 (카테고리별로 묶어서 표시)
  - `app/[date]/page.tsx` — 날짜별 히스토리
  - 좌측 사이드바(`components/Sidebar.tsx`)에서 최신 + 과거 3일 다이제스트로 바로 이동 가능
- **수집·요약**: `scripts/collect.mts`
  1. `https://news.kicpa.or.kr/news/articleList.html?view_type=sm` 목록 파싱, 신규 기사 중 최대 10건만 처리
  2. `data/seen.json`과 비교해 신규 기사만 추림
  3. 기사 상세페이지에서 본문(`#article-view-content-div`)과 카테고리(`nav.rooted` breadcrumb)를 가져와 OpenAI API(`gpt-5.4-mini`, 유료·사용량 과금)로 요약
  4. `data/YYYY-MM-DD.json`, `data/index.json`, `data/seen.json`에 저장
- **자동화**: `.github/workflows/daily-digest.yml`이 매일 01:00 UTC(10:00 KST)에 `npm run collect`를 실행하고 결과를 커밋·푸시합니다. Vercel이 해당 저장소를 연결해두면 push마다 자동 재배포됩니다.

## 로컬에서 실행

```bash
npm install
cp .env.local.example .env.local   # OPENAI_API_KEY 채워넣기 (https://platform.openai.com/api-keys)
npm run collect                    # 뉴스 수집 + 요약 (data/ 갱신)
npm run dev                        # http://localhost:3000
```

## 배포

1. GitHub 저장소를 만들고 push
2. 저장소 Settings → Secrets에 `OPENAI_API_KEY` 등록 (GitHub Actions에서 사용)
3. Vercel에 이 저장소를 연결 (별도 환경변수 불필요 — 사이트는 이미 요약된 `data/*.json`만 읽습니다)
4. Actions 탭에서 "Daily CPA News Digest" 워크플로우를 `workflow_dispatch`로 한 번 수동 실행해 정상 동작 확인
