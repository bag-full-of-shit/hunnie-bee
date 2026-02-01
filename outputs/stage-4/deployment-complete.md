# Hunnie-Bee 배포 가이드

## 프로젝트 요약

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Hunnie-Bee |
| 설명 | 1년에 100번 목표 달성을 추적하는 습관 앱 |
| 버전 | 1.0.0 |
| 상태 | 개발 완료 ✅ |

---

## 🚀 로컬에서 실행하기

### 1. 프로젝트 디렉토리로 이동

```bash
cd hunnie-bee
```

### 2. 의존성 설치 (최초 1회)

```bash
npm install
```

### 3. 개발 서버 실행

```bash
npm start
```

실행 후 선택 옵션:
- **`w`**: 웹 브라우저에서 열기
- **`i`**: iOS 시뮬레이터에서 열기 (Mac 전용)
- **`a`**: Android 에뮬레이터에서 열기

### 4. 직접 플랫폼별 실행

```bash
# 웹 브라우저
npm run web

# iOS (Mac 전용, Xcode 필요)
npm run ios

# Android (Android Studio 필요)
npm run android
```

---

## 📱 Expo Go 앱에서 테스트

### iOS
1. App Store에서 "Expo Go" 앱 설치
2. `npm start` 실행 후 표시되는 QR 코드 스캔

### Android
1. Play Store에서 "Expo Go" 앱 설치
2. `npm start` 실행 후 표시되는 QR 코드 스캔

---

## 🌐 Vercel 배포 가이드

### 1. Vercel CLI 설치 및 로그인

```bash
npm install -g vercel
vercel login
```

### 2. 배포 실행

```bash
cd hunnie-bee
vercel --prod
```

### 3. 배포 후 URL

배포 완료 시 다음과 같은 URL이 생성됩니다:
- Production: `https://hunnie-bee.vercel.app`
- Preview: `https://hunnie-bee-xxxxx.vercel.app`

---

## 📦 프로덕션 빌드 (앱 스토어 배포)

### EAS Build 설정

```bash
# EAS CLI 설치
npm install -g eas-cli

# EAS 로그인
eas login

# 빌드 설정 (최초 1회)
eas build:configure
```

### iOS 빌드

```bash
# 개발용 빌드
eas build --platform ios --profile development

# 앱 스토어 제출용
eas build --platform ios --profile production
```

### Android 빌드

```bash
# 개발용 빌드
eas build --platform android --profile development

# Play Store 제출용
eas build --platform android --profile production
```

---

## 📁 프로젝트 구조

```
hunnie-bee/
├── app/                    # 화면 (Expo Router)
│   ├── (tabs)/            # 탭 네비게이션
│   │   ├── index.tsx      # 홈 (목표 목록)
│   │   ├── history.tsx    # 기록 히스토리
│   │   └── settings.tsx   # 설정
│   └── goal/
│       ├── create.tsx     # 목표 생성
│       └── [id].tsx       # 목표 상세
├── components/            # UI 컴포넌트
├── stores/               # 상태 관리 (Zustand)
├── repositories/         # 데이터 레이어
├── types/               # TypeScript 타입
├── constants/           # 상수 (색상, 간격 등)
└── utils/              # 유틸리티 함수
```

---

## 🎯 주요 기능

1. **목표 생성**: 제목, 이모지, 목표 횟수 설정
2. **벌집 시각화**: 100개의 육각형 셀로 진행 상황 표시
3. **실천 기록**: 버튼 한 번으로 기록 + 햅틱 피드백
4. **진행률 표시**: 현재/목표, 퍼센트, 남은 횟수
5. **기록 히스토리**: 날짜별 실천 기록 조회
6. **로컬 저장**: AsyncStorage로 데이터 저장

---

## 🔧 확장 계획

### Supabase 연동 (Post-MVP)

1. Supabase 프로젝트 생성
2. `repositories/supabaseRepository.ts` 구현
3. `repositories/index.ts`에서 repository 교체

```typescript
// repositories/index.ts
import { SupabaseRepository } from './supabaseRepository';
export const repository = new SupabaseRepository();
```

---

## 📊 빌드 결과

| 플랫폼 | 상태 | 비고 |
|--------|------|------|
| Web | ✅ 빌드 성공 | `npx expo export --platform web` |
| iOS | 🔧 로컬 테스트 가능 | Expo Go 또는 EAS Build |
| Android | 🔧 로컬 테스트 가능 | Expo Go 또는 EAS Build |

---

## 🐝 완료!

Hunnie-Bee 앱이 성공적으로 개발되었습니다!

### 다음 단계
1. `npm start`로 로컬에서 테스트
2. Expo Go 앱으로 모바일에서 테스트
3. Vercel/EAS로 배포

---

**Stage 4 완료일**: 2026-02-01
**개발 기간**: Stage 0~4 (아이디어부터 배포까지)
