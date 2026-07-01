# CPA뉴스 데일리 다이제스트

매일 오전 7시(KST), [news.kicpa.or.kr](https://news.kicpa.or.kr/)에 새로 올라온 기사를 수집해 제목과 3문장 요약으로 정리해 보여주는 사이트입니다.

## 구조

- **웹사이트**: Next.js (App Router). `data/*.json`을 읽어 렌더링합니다.
  - `app/page.tsx` — 가장 최근 다이제스트
  - `app/[date]/page.tsx` — 날짜별 히스토리
- **수집·요약**: `scripts/collect.mts`
  1. `https://news.kicpa.or.kr/news/articleList.html?view_type=sm` 목록 파싱
  2. `data/seen.json`과 비교해 신규 기사만 추림
  3. 기사 본문(`#article-view-content-div`)을 가져와 OpenAI API(`gpt-5.4-mini`, 유료·사용량 과금)로 요약
  4. `data/YYYY-MM-DD.json`, `data/index.json`, `data/seen.json`에 저장
- **자동화**: `.github/workflows/daily-digest.yml`이 매일 22:00 UTC(07:00 KST)에 `npm run collect`를 실행하고 결과를 커밋·푸시합니다. Vercel이 해당 저장소를 연결해두면 push마다 자동 재배포됩니다.

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
