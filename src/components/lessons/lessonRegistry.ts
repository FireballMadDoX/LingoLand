// Lesson registry - imports all lesson JSON files
// Each lesson contains data for all 3 languages (en, es, zh)

import lesson01 from './lesson_json/lesson-01.json';
import lesson02 from './lesson_json/lesson-02.json';
import lesson03 from './lesson_json/lesson-03.json';
import lesson04 from './lesson_json/lesson-04.json';
import lesson05 from './lesson_json/lesson-05.json';
import lesson06 from './lesson_json/lesson-06.json';
import lesson07 from './lesson_json/lesson-07.json';
import lesson08 from './lesson_json/lesson-08.json';
import lesson09 from './lesson_json/lesson-09.json';
import lesson10 from './lesson_json/lesson-10.json';
import lesson11 from './lesson_json/lesson-11.json';
import lesson12 from './lesson_json/lesson-12.json';
import lesson13 from './lesson_json/lesson-13.json';
import lesson14 from './lesson_json/lesson-14.json';
import lesson15 from './lesson_json/lesson-15.json';
import lesson16 from './lesson_json/lesson-16.json';
import lesson17 from './lesson_json/lesson-17.json';
import lesson18 from './lesson_json/lesson-18.json';
import lesson19 from './lesson_json/lesson-19.json';
import lesson20 from './lesson_json/lesson-20.json';

export const LESSON_DATA: Record<string, any> = {
  'lesson-01': lesson01,
  'lesson-02': lesson02,
  'lesson-03': lesson03,
  'lesson-04': lesson04,
  'lesson-05': lesson05,
  'lesson-06': lesson06,
  'lesson-07': lesson07,
  'lesson-08': lesson08,
  'lesson-09': lesson09,
  'lesson-10': lesson10,
  'lesson-11': lesson11,
  'lesson-12': lesson12,
  'lesson-13': lesson13,
  'lesson-14': lesson14,
  'lesson-15': lesson15,
  'lesson-16': lesson16,
  'lesson-17': lesson17,
  'lesson-18': lesson18,
  'lesson-19': lesson19,
  'lesson-20': lesson20,
};

export const getLessonData = (lessonId: string): any | null => {
  return LESSON_DATA[lessonId] || null;
};

// Lesson metadata for UI display
export interface LessonMeta {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  emoji: string;
  steps: number;
}

export const LESSON_CATALOGUE: LessonMeta[] = [
  { id: 'lesson-01', number: 1, title: 'Greetings & Introductions', subtitle: 'Hello, name, basic phrases', emoji: '👋', steps: 6 },
  { id: 'lesson-02', number: 2, title: 'How Are You?', subtitle: 'Feelings and responses', emoji: '😊', steps: 6 },
  { id: 'lesson-03', number: 3, title: 'Colors', subtitle: 'Red, blue, yellow, green', emoji: '🎨', steps: 6 },
  { id: 'lesson-04', number: 4, title: 'Family', subtitle: 'Mom, dad, brother, sister', emoji: '👨‍👩‍👧‍👦', steps: 6 },
  { id: 'lesson-05', number: 5, title: 'Food', subtitle: 'Apple, bread, water, rice', emoji: '🍎', steps: 6 },
  { id: 'lesson-06', number: 6, title: 'Animals', subtitle: 'Dog, cat, bird, fish', emoji: '🐕', steps: 6 },
  { id: 'lesson-07', number: 7, title: 'Numbers 1-4', subtitle: 'Counting one to four', emoji: '🔢', steps: 6 },
  { id: 'lesson-08', number: 8, title: 'School Objects', subtitle: 'Book, pen, desk, bag', emoji: '📚', steps: 6 },
  { id: 'lesson-09', number: 9, title: 'Weather', subtitle: 'Sunny, rainy, cloudy, windy', emoji: '☀️', steps: 6 },
  { id: 'lesson-10', number: 10, title: 'Feelings', subtitle: 'Sad, excited, angry, calm', emoji: '😌', steps: 6 },
  { id: 'lesson-11', number: 11, title: 'Polite Phrases', subtitle: 'Good morning, nice to meet you', emoji: '🙏', steps: 6 },
  { id: 'lesson-12', number: 12, title: 'More Feelings', subtitle: 'Sad, excited, nervous, okay', emoji: '🫂', steps: 6 },
  { id: 'lesson-13', number: 13, title: 'More Colors', subtitle: 'Black, white, orange, purple', emoji: '🌈', steps: 6 },
  { id: 'lesson-14', number: 14, title: 'Extended Family', subtitle: 'Grandma, grandpa, aunt, uncle', emoji: '👴', steps: 6 },
  { id: 'lesson-15', number: 15, title: 'More Food', subtitle: 'Milk, juice, banana, noodles', emoji: '🍜', steps: 6 },
  { id: 'lesson-16', number: 16, title: 'More Animals', subtitle: 'Horse, rabbit, tiger, elephant', emoji: '🐘', steps: 6 },
  { id: 'lesson-17', number: 17, title: 'Numbers 5-8', subtitle: 'Counting five to eight', emoji: '8️⃣', steps: 6 },
  { id: 'lesson-18', number: 18, title: 'More School Objects', subtitle: 'Chair, pencil, teacher, notebook', emoji: '✏️', steps: 6 },
  { id: 'lesson-19', number: 19, title: 'More Weather', subtitle: 'Snowy, hot, cold, stormy', emoji: '❄️', steps: 6 },
  { id: 'lesson-20', number: 20, title: 'More Emotions', subtitle: 'Scared, proud, sleepy, surprised', emoji: '😲', steps: 6 },
];
