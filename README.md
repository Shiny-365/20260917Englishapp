# English Ear 👂

리스닝(듣기)과 스피킹(말하기)으로 영어 단어를 익히는 Expo(React Native) 앱입니다.

## 주요 기능

- **듣기 연습**: 단어를 TTS로 들려주고, 4지선다로 알맞은 뜻을 고릅니다. (빠르게/천천히 다시 듣기 지원)
- **말하기 연습**: 단어와 뜻, 예문을 보여주고 마이크로 발음하면 음성 인식 결과와 정답 여부를 알려줍니다.
- **AI 튜터**: 사용자가 입력한 본인의 Gemini API 키로 오늘의 단어를 활용한 짧은 영어 대화를 나눕니다. 마이크로 말해도, 타이핑해도 됩니다.
- **진행 상황**: 카테고리별 단어 목록과 학습 상태(시작 전 / 학습 중 / 완전히 익힘)를 확인하고 기록을 초기화할 수 있습니다.

단어는 동물/음식/여행/일상/감정/직장 6개 카테고리, 총 48개가 내장되어 있습니다 (`src/data/words.ts`).

## 기술 스택

- Expo SDK 57 + React Native + TypeScript
- `expo-speech`: 텍스트 음성 변환(TTS)
- `expo-speech-recognition`: 음성 인식(STT) — iOS/Android/Web 지원
- `@react-navigation`(bottom-tabs): 화면 이동
- `@react-native-async-storage/async-storage`: 로컬 학습 기록 저장 (서버/로그인 불필요)
- Gemini API(`gemini-3.5-flash-lite`, REST 직접 호출): AI 튜터 대화 생성. 사용자가 직접 발급받은 API 키를 앱에 입력하며, `expo-secure-store`(웹은 AsyncStorage로 폴백)로 기기에만 저장됩니다. 키는 대화할 때마다 기기에서 Google Gemini API로 직접 전송되고, 별도의 백엔드 서버는 거치지 않습니다.

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
- AI 튜터를 쓰려면 [Google AI Studio](https://aistudio.google.com/apikey)에서 무료로 Gemini API 키를 발급받아 앱의 "AI 튜터" 탭에 입력하면 됩니다. 키는 이 앱 코드에 하드코딩되어 있지 않고, 사용자가 입력한 값만 기기에 저장됩니다.
