import type { Word, WordCategory } from '../types/word';

export const CATEGORY_LABELS: Record<WordCategory, string> = {
  animals: '동물',
  food: '음식',
  travel: '여행',
  daily: '일상',
  emotions: '감정',
  work: '직장',
};

export const WORDS: Word[] = [
  // animals
  { id: 'dog', text: 'dog', meaning: '개', example: 'The dog is sleeping on the sofa.', category: 'animals' },
  { id: 'cat', text: 'cat', meaning: '고양이', example: 'My cat likes to sit by the window.', category: 'animals' },
  { id: 'elephant', text: 'elephant', meaning: '코끼리', example: 'The elephant walked slowly across the field.', category: 'animals' },
  { id: 'rabbit', text: 'rabbit', meaning: '토끼', example: 'The rabbit hid behind the tree.', category: 'animals' },
  { id: 'horse', text: 'horse', meaning: '말', example: 'She rides her horse every morning.', category: 'animals' },
  { id: 'lion', text: 'lion', meaning: '사자', example: 'The lion roared loudly in the zoo.', category: 'animals' },
  { id: 'tiger', text: 'tiger', meaning: '호랑이', example: 'The tiger has orange and black stripes.', category: 'animals' },
  { id: 'monkey', text: 'monkey', meaning: '원숭이', example: 'The monkey climbed up the tall tree.', category: 'animals' },

  // food
  { id: 'apple', text: 'apple', meaning: '사과', example: 'I eat an apple every day.', category: 'food' },
  { id: 'bread', text: 'bread', meaning: '빵', example: 'She bought fresh bread from the bakery.', category: 'food' },
  { id: 'coffee', text: 'coffee', meaning: '커피', example: 'He drinks coffee every morning.', category: 'food' },
  { id: 'chicken', text: 'chicken', meaning: '치킨(닭고기)', example: 'We had chicken for dinner.', category: 'food' },
  { id: 'rice', text: 'rice', meaning: '쌀, 밥', example: 'Rice is a staple food in many countries.', category: 'food' },
  { id: 'soup', text: 'soup', meaning: '수프', example: 'The soup was hot and delicious.', category: 'food' },
  { id: 'noodle', text: 'noodle', meaning: '국수', example: 'I love eating noodle soup in winter.', category: 'food' },
  { id: 'vegetable', text: 'vegetable', meaning: '채소', example: 'You should eat more vegetable every day.', category: 'food' },

  // travel
  { id: 'airport', text: 'airport', meaning: '공항', example: 'We arrived at the airport two hours early.', category: 'travel' },
  { id: 'passport', text: 'passport', meaning: '여권', example: 'Do not forget your passport at home.', category: 'travel' },
  { id: 'luggage', text: 'luggage', meaning: '짐, 수하물', example: 'My luggage was too heavy to carry.', category: 'travel' },
  { id: 'ticket', text: 'ticket', meaning: '표, 티켓', example: 'I bought a ticket for the next train.', category: 'travel' },
  { id: 'hotel', text: 'hotel', meaning: '호텔', example: 'We stayed at a nice hotel near the beach.', category: 'travel' },
  { id: 'map', text: 'map', meaning: '지도', example: 'She looked at the map to find the street.', category: 'travel' },
  { id: 'station', text: 'station', meaning: '역', example: 'The train station is very crowded today.', category: 'travel' },
  { id: 'taxi', text: 'taxi', meaning: '택시', example: 'We took a taxi to the hotel.', category: 'travel' },

  // daily
  { id: 'breakfast', text: 'breakfast', meaning: '아침 식사', example: 'I usually eat breakfast at seven.', category: 'daily' },
  { id: 'umbrella', text: 'umbrella', meaning: '우산', example: 'Take an umbrella, it might rain today.', category: 'daily' },
  { id: 'calendar', text: 'calendar', meaning: '달력', example: 'She wrote the date on the calendar.', category: 'daily' },
  { id: 'mirror', text: 'mirror', meaning: '거울', example: 'He looked at himself in the mirror.', category: 'daily' },
  { id: 'pillow', text: 'pillow', meaning: '베개', example: 'This pillow is very soft and comfortable.', category: 'daily' },
  { id: 'towel', text: 'towel', meaning: '수건', example: 'Please hand me a clean towel.', category: 'daily' },
  { id: 'key', text: 'key', meaning: '열쇠', example: 'I lost the key to my front door.', category: 'daily' },
  { id: 'wallet', text: 'wallet', meaning: '지갑', example: 'My wallet was in my back pocket.', category: 'daily' },

  // emotions
  { id: 'happy', text: 'happy', meaning: '행복한', example: 'She felt happy after hearing the news.', category: 'emotions' },
  { id: 'sad', text: 'sad', meaning: '슬픈', example: 'He looked sad after the movie ended.', category: 'emotions' },
  { id: 'angry', text: 'angry', meaning: '화난', example: 'My brother was angry about the delay.', category: 'emotions' },
  { id: 'nervous', text: 'nervous', meaning: '긴장한', example: 'I felt nervous before the exam.', category: 'emotions' },
  { id: 'excited', text: 'excited', meaning: '신난, 흥분한', example: 'The kids were excited about the trip.', category: 'emotions' },
  { id: 'tired', text: 'tired', meaning: '피곤한', example: 'She was tired after the long meeting.', category: 'emotions' },
  { id: 'proud', text: 'proud', meaning: '자랑스러운', example: 'His parents were proud of his grades.', category: 'emotions' },
  { id: 'surprised', text: 'surprised', meaning: '놀란', example: 'I was surprised by the sudden noise.', category: 'emotions' },

  // work
  { id: 'meeting', text: 'meeting', meaning: '회의', example: 'We have a meeting at ten tomorrow.', category: 'work' },
  { id: 'deadline', text: 'deadline', meaning: '마감일', example: 'The deadline for this project is Friday.', category: 'work' },
  { id: 'email', text: 'email', meaning: '이메일', example: 'Please send me an email with the details.', category: 'work' },
  { id: 'colleague', text: 'colleague', meaning: '동료', example: 'My colleague helped me finish the report.', category: 'work' },
  { id: 'salary', text: 'salary', meaning: '급여', example: 'She negotiated a higher salary.', category: 'work' },
  { id: 'interview', text: 'interview', meaning: '면접', example: 'He has a job interview next week.', category: 'work' },
  { id: 'resume', text: 'resume', meaning: '이력서', example: 'I updated my resume before applying.', category: 'work' },
  { id: 'schedule', text: 'schedule', meaning: '일정', example: 'Let me check my schedule for Monday.', category: 'work' },
];

export function getWordById(id: string): Word | undefined {
  return WORDS.find((w) => w.id === id);
}

export function getWordsByCategory(category: WordCategory): Word[] {
  return WORDS.filter((w) => w.category === category);
}
