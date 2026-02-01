# Hunnie-Bee 빌드 설정

## 프로젝트 정보

| 항목 | 값 |
|------|-----|
| 프로젝트명 | Hunnie-Bee |
| 버전 | 1.0.0 |
| 프레임워크 | Expo SDK 54 |
| 언어 | TypeScript |

## 기술 스택

### 프론트엔드
- **Expo**: 54.0.33
- **React Native**: 0.81.5
- **React**: 19.1.0
- **TypeScript**: 5.9.2

### 핵심 라이브러리
| 패키지 | 버전 | 용도 |
|--------|------|------|
| expo-router | 6.0.22 | 파일 기반 네비게이션 |
| zustand | 5.0.11 | 상태 관리 |
| @react-native-async-storage/async-storage | 2.2.0 | 로컬 저장소 |
| react-native-svg | 15.15.1 | SVG 렌더링 (벌집 UI) |
| expo-haptics | 15.0.8 | 햅틱 피드백 |
| uuid | 13.0.0 | 고유 ID 생성 |

## 프로젝트 구조

```
hunnie-bee/
├── app/                    # Expo Router 페이지
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── _layout.tsx    # 탭 레이아웃
│   │   ├── index.tsx      # 홈 화면
│   │   ├── history.tsx    # 기록 화면
│   │   └── settings.tsx   # 설정 화면
│   ├── goal/
│   │   ├── create.tsx     # 목표 생성
│   │   └── [id].tsx       # 목표 상세
│   └── _layout.tsx        # 루트 레이아웃
├── components/            # 재사용 컴포넌트
│   ├── ui/               # 기본 UI
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── EmojiPicker.tsx
│   ├── goal/             # 목표 관련
│   │   ├── GoalCard.tsx
│   │   └── ProgressDisplay.tsx
│   ├── honeycomb/        # 벌집 시각화
│   │   └── HoneycombGrid.tsx
│   └── index.ts
├── stores/               # Zustand 스토어
│   └── goalStore.ts
├── repositories/         # 데이터 레이어
│   ├── types.ts          # 인터페이스
│   ├── localRepository.ts # AsyncStorage 구현
│   └── index.ts
├── utils/               # 유틸리티
│   └── index.ts
├── constants/           # 상수
│   └── index.ts
├── types/              # TypeScript 타입
│   └── index.ts
├── app.json            # Expo 설정
├── package.json
└── tsconfig.json
```

## 구현된 기능

### MVP 기능 (완료)
- [x] 목표 생성 (제목, 이모지, 목표 횟수)
- [x] 목표 목록 조회
- [x] 목표 상세 화면
- [x] 벌집 그리드 시각화 (100개 셀)
- [x] 실천 기록 (버튼 클릭)
- [x] 진행률 표시 (현재/목표, 퍼센트)
- [x] 햅틱 피드백
- [x] 목표 삭제
- [x] 기록 히스토리 조회
- [x] 설정 화면 (데이터 초기화)

### 아키텍처 특징
- **Repository 패턴**: 데이터 접근 레이어 추상화로 향후 Supabase 연동 용이
- **Zustand**: 간결한 상태 관리
- **Expo Router**: 파일 기반 네비게이션

## 스크립트

```bash
# 개발 서버 실행
npm start

# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

## 빌드 명령어

### 개발 빌드
```bash
npx expo start
```

### 프로덕션 빌드 (EAS)
```bash
# EAS 설정 (최초 1회)
npx eas-cli build:configure

# iOS 빌드
npx eas build --platform ios

# Android 빌드
npx eas build --platform android
```

### 웹 빌드
```bash
npx expo export --platform web
```

## 환경 설정

### app.json 주요 설정
```json
{
  "expo": {
    "name": "Hunnie-Bee",
    "slug": "hunnie-bee",
    "version": "1.0.0",
    "scheme": "hunnie-bee",
    "splash": {
      "backgroundColor": "#FBBF24"
    }
  }
}
```

## 확장 계획

### Phase 2: Supabase 연동
1. `repositories/supabaseRepository.ts` 생성
2. `repositories/index.ts`에서 repository 교체
3. 인증 로직 추가

### 예시 코드
```typescript
// repositories/index.ts
import { SupabaseRepository } from './supabaseRepository';

// LocalRepository 대신 SupabaseRepository 사용
export const repository = new SupabaseRepository();
```

---

**빌드 상태**: 성공 ✅
**최종 빌드**: 2026-02-01
**플랫폼**: iOS, Android, Web
