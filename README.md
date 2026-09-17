# English Ear 👂

리스닝(듣기)과 스피킹(말하기)으로 영어 단어를 익히는 Expo(React Native) 앱입니다.

## 주요 기능

- **듣기 연습**: 단어를 TTS로 들려주고, 4지선다로 알맞은 뜻을 고릅니다. (빠르게/천천히 다시 듣기 지원)
- **말하기 연습**: 단어와 뜻, 예문을 보여주고 마이크로 발음하면 음성 인식 결과와 정답 여부를 알려줍니다.
- **진행 상황**: 카테고리별 단어 목록과 학습 상태(시작 전 / 학습 중 / 완전히 익힘)를 확인하고 기록을 초기화할 수 있습니다.

단어는 동물/음식/여행/일상/감정/직장 6개 카테고리, 총 48개가 내장되어 있습니다 (`src/data/words.ts`).

## 기술 스택

- Expo SDK 57 + React Native + TypeScript
- `expo-speech`: 텍스트 음성 변환(TTS)
- `expo-speech-recognition`: 음성 인식(STT) — iOS/Android/Web 지원
- `@react-navigation`(bottom-tabs): 화면 이동
- `@react-native-async-storage/async-storage`: 로컬 학습 기록 저장 (서버/로그인 불필요)

## 실행 방법

```bash
npm install

# 브라우저에서 빠르게 확인 (react-native-web)
npm run web

# 실제 기기/시뮬레이터 (development build 필요 — 음성 인식은 네이티브 모듈이라 Expo Go에서 동작하지 않을 수 있습니다)
npx expo run:android
npx expo run:ios
```

## 참고

- 음성 인식(`expo-speech-recognition`)은 커스텀 네이티브 모듈을 포함하므로, Android/iOS에서 제대로 테스트하려면 `npx expo run:android` / `npx expo run:ios`로 development build를 생성해야 합니다.
- 마이크 및 음성 인식 권한 문구는 `app.json`에 설정되어 있습니다.
