# Hunnie-Bee 🐝

**1년에 100번, 꾸준히 모아가는 습관**

매일 해야 한다는 부담 대신, 1년에 100번만 채우면 되는 새로운 방식의 습관 트래킹 앱입니다.

## 핵심 컨셉

- 전통적인 "매일 연속 달성" 방식의 부담감을 제거
- 100칸 벌집(Honeycomb) 시각화로 진행 상황을 직관적으로 표시
- 놓친 날에 대한 죄책감 없이 꾸준한 습관 형성 가능

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Expo SDK 54 (React Native) |
| 언어 | TypeScript |
| 라우팅 | Expo Router (파일 기반) |
| 상태관리 | Zustand |
| 데이터 저장 | AsyncStorage (로컬) |
| 시각화 | React Native SVG |
| 배포 (웹) | Vercel |
| 배포 (모바일) | EAS Build |

## 프로젝트 구조

```
├── app/                    # 페이지 (Expo Router)
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── index.tsx      # 홈 (목표 목록)
│   │   ├── history.tsx    # 기록 내역
│   │   └── settings.tsx   # 설정
│   └── goal/              # 목표 관련 페이지
│       ├── create.tsx     # 목표 생성
│       └── [id].tsx       # 목표 상세
├── components/            # 재사용 컴포넌트
├── stores/                # Zustand 스토어
├── repositories/          # 데이터 접근 계층
├── types/                 # TypeScript 타입
├── utils/                 # 유틸리티 함수
└── constants/             # 상수 정의
```

## 실행 방법

### 의존성 설치

```bash
npm install
```

### 개발 서버 실행

```bash
# Expo Go 앱으로 실행 (QR 코드 스캔)
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

### 배포

```bash
# 웹 (Vercel)
npx vercel deploy

# 모바일 (EAS Build)
eas build --platform ios
eas build --platform android
```

## 주요 기능

- **목표 생성**: 이모지, 제목, 목표 횟수 설정
- **원탭 기록**: 버튼 한 번으로 오늘의 실천 기록
- **벌집 시각화**: 100칸 육각형 그리드로 진행률 표시
- **기록 내역**: 전체 실천 기록 조회
- **데이터 관리**: 로컬 저장소 기반 데이터 보존

## 환경 요구사항

- Node.js 18+
- iOS 14+ / Android 7.0+
- 외부 API 연동 없음 (완전 오프라인 지원)
- 환경 변수 설정 불필요
