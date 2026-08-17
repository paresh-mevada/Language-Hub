import mongoose from 'mongoose';
import Lesson, { LESSON_CATEGORIES, LESSON_LEVELS } from '../models/Lesson.js';
import UserLessonProgress from '../models/UserLessonProgress.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function createError(message, statusCode) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

const SEED_LESSONS = [
  {
    title: 'Mastering Past Tenses in English',
    description: 'Learn the differences between Simple Past, Past Continuous, and Past Perfect with practical examples.',
    category: 'Grammar',
    level: 'Intermediate',
    duration: '15 mins',
    language: 'English',
    content: `### Understanding Past Tenses

In English, we use different past tenses depending on when events happened relative to each other.

#### 1. Simple Past
Used for completed actions at a specific time in the past.
- *Example*: "I **visited** Paris last summer."

#### 2. Past Continuous
Used for ongoing actions happening at a specific past moment or interrupted by another event.
- *Example*: "I **was studying** when the phone rang."

#### 3. Past Perfect
Used for an action that was completed before another action in the past.
- *Example*: "She **had finished** her homework before dinner started."`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Choose the correct form: "When I arrived at the station, the train _____."',
        options: ['already left', 'had already left', 'was already leave', 'has left'],
        correctAnswer: 'had already left',
        explanation: 'Use Past Perfect ("had left") for an action that happened before another past action ("arrived").',
      },
      {
        type: 'fill_in_the_blank',
        question: 'Fill in the blank with Simple Past of "go": "Yesterday, we _____ to the beach."',
        correctAnswer: 'went',
        explanation: 'The past tense of "go" is irregular: "went".',
      },
      {
        type: 'multiple_choice',
        question: 'Which tense is used in: "They were playing football at 5 PM yesterday"?',
        options: ['Simple Past', 'Past Continuous', 'Past Perfect', 'Present Perfect'],
        correctAnswer: 'Past Continuous',
        explanation: '"Were playing" indicates an ongoing action in the past (Past Continuous).',
      },
    ],
  },
  {
    title: 'Essential Travel & Airport Vocabulary',
    description: 'Build confidence for international travel, airport check-ins, customs, and directions.',
    category: 'Vocabulary',
    level: 'Beginner',
    duration: '12 mins',
    language: 'English',
    content: `### Key Travel Expressions

Navigating an airport can be stressful. Here are the most essential terms and phrases:

- **Boarding Pass**: The document giving you permission to enter your plane.
- **Baggage Claim**: The area where arriving passengers collect luggage.
- **Customs & Immigration**: Where border officers inspect passports and goods.
- **Carry-on Bag**: Small luggage you take inside the aircraft cabin.

#### Sample Conversation:
- *Passenger*: "Where is Gate B12?"
- *Agent*: "Go straight down the main corridor and turn left past security."`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Where do you pick up your suitcases after landing?',
        options: ['Check-in counter', 'Baggage Claim', 'Security Control', 'Gate'],
        correctAnswer: 'Baggage Claim',
        explanation: 'Baggage Claim is the area designated for retrieving checked luggage after arrival.',
      },
      {
        type: 'fill_in_the_blank',
        question: 'Fill in the missing word: "You must show your _____ pass before boarding the plane."',
        correctAnswer: 'boarding',
        explanation: 'A boarding pass is required to board an airplane.',
      },
    ],
  },
  {
    title: 'Effective Professional Emails',
    description: 'Learn formal greetings, professional phrasing, call to action, and polite sign-offs.',
    category: 'Writing',
    level: 'Intermediate',
    duration: '20 mins',
    language: 'English',
    content: `### Professional Email Structure

1. **Subject Line**: Direct and clear (e.g., *Project Update - Q3 Milestones*).
2. **Salutation**:
   - Formal: *Dear Mr. Smith,* or *Dear Hiring Team,*
   - Semi-formal: *Hi Sarah,*
3. **Opening Line**: State your intent directly: *I am writing to inquire about...*
4. **Call to Action**: *Could you please confirm your availability by Thursday?*
5. **Sign-off**: *Best regards,* or *Sincerely,*`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'Which of the following is the most professional sign-off for a business email?',
        options: ['See ya laterr!', 'Best regards,', 'Thx', 'Cheers bro'],
        correctAnswer: 'Best regards,',
        explanation: '"Best regards," is universally accepted as professional and polite.',
      },
      {
        type: 'fill_in_the_blank',
        question: 'Complete the formal phrase: "I am writing to _____ about the status of our order."',
        correctAnswer: 'inquire',
        explanation: '"Inquire" means to ask for information in a polite, formal tone.',
      },
    ],
  },
  {
    title: 'Active Listening & Conversational Cues',
    description: 'Improve comprehension of fast native speech and learn active listening responses.',
    category: 'Listening',
    level: 'Upper Intermediate',
    duration: '18 mins',
    language: 'English',
    content: `### Connected Speech & Listening Strategies

Native speakers often compress words together:
- *"What do you do?"* sounds like *"Whadya do?"*
- *"Going to"* becomes *"Gonna"*

#### Backchanneling Responses
Show engagement without interrupting:
- *"I see."* / *"That makes sense."* / *"Exactly!"* / *"Are you serious?"*`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'What is "backchanneling" in conversation?',
        options: [
          'Ignoring the speaker',
          'Short verbal cues showing you are listening (e.g., "I see")',
          'Interrupting loudly',
          'Translating words in your head',
        ],
        correctAnswer: 'Short verbal cues showing you are listening (e.g., "I see")',
        explanation: 'Backchanneling signals to the speaker that you are engaged and paying attention.',
      },
    ],
  },
  {
    title: 'Confident Everyday Conversations',
    description: 'Practice natural idioms, small talk topics, and smooth conversation transitions.',
    category: 'Speaking',
    level: 'Elementary',
    duration: '15 mins',
    language: 'English',
    content: `### Small Talk Masterclass

Great topics for starting friendly conversations:
1. **Weather**: *"Nice weather today, isn't it?"*
2. **Weekend Plans**: *"Any fun plans for the weekend?"*
3. **Work/Studies**: *"How was your week so far?"*

#### Pro Tip:
Always answer and ask a quick follow-up question back!`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'What is a great follow-up response to "How was your weekend?"',
        options: [
          '"Good. What about yours?"',
          '"I do not care."',
          '"No comment."',
          '"Goodbye."',
        ],
        correctAnswer: '"Good. What about yours?"',
        explanation: 'Asking "What about yours?" keeps the flow of natural conversation going.',
      },
    ],
  },
  {
    title: 'Reading News & Analytical Articles',
    description: 'Develop speed reading, identify main arguments, and guess context meanings.',
    category: 'Reading',
    level: 'Advanced',
    duration: '22 mins',
    language: 'English',
    content: `### Skimming and Scanning Techniques

- **Skimming**: Reading quickly to get the overall main idea (gist).
- **Scanning**: Searching for specific information like numbers, names, or dates.
- **Context Clues**: Inferring unfamiliar words from surrounding sentences.`,
    exercises: [
      {
        type: 'multiple_choice',
        question: 'What is the primary goal of "skimming" a document?',
        options: [
          'Memorizing every word',
          'Getting the general main idea quickly',
          'Finding a specific phone number',
          'Proofreading spelling',
        ],
        correctAnswer: 'Getting the general main idea quickly',
        explanation: 'Skimming allows you to grasp the core topic before reading in detail.',
      },
    ],
  },
];

async function ensureSeedLessons() {
  const count = await Lesson.countDocuments();
  if (count === 0) {
    await Lesson.insertMany(SEED_LESSONS);
  }
}

export const getLessons = asyncHandler(async (request, response) => {
  await ensureSeedLessons();

  const { category, level, search } = request.query;
  const query = {};

  if (category && category !== 'All') {
    if (!LESSON_CATEGORIES.includes(category)) {
      throw createError('Invalid category filter.', 400);
    }
    query.category = category;
  }

  if (level && level !== 'All') {
    if (!LESSON_LEVELS.includes(level)) {
      throw createError('Invalid level filter.', 400);
    }
    query.level = level;
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), 'i');
    query.$or = [{ title: regex }, { description: regex }];
  }

  const lessons = await Lesson.find(query).sort({ createdAt: -1 }).lean();
  const userProgresses = await UserLessonProgress.find({ userId: request.user.id }).lean();
  const progressMap = new Map(userProgresses.map((p) => [p.lessonId.toString(), p]));

  const enrichedLessons = lessons.map((lesson) => {
    const progress = progressMap.get(lesson._id.toString());
    return {
      ...lesson,
      isCompleted: progress?.isCompleted || false,
      score: progress?.score || 0,
      maxScore: progress?.maxScore || lesson.exercises.length,
      percentage: progress?.maxScore ? Math.round((progress.score / progress.maxScore) * 100) : 0,
    };
  });

  response.status(200).json({
    success: true,
    message: 'Lessons retrieved successfully.',
    data: { lessons: enrichedLessons },
  });
});

export const getLessonById = asyncHandler(async (request, response) => {
  await ensureSeedLessons();

  const { id } = request.params;
  if (!mongoose.isValidObjectId(id)) {
    throw createError('Invalid lesson ID.', 400);
  }

  const lesson = await Lesson.findById(id).lean();
  if (!lesson) {
    throw createError('Lesson not found.', 404);
  }

  const progress = await UserLessonProgress.findOne({
    userId: request.user.id,
    lessonId: lesson._id,
  }).lean();

  response.status(200).json({
    success: true,
    message: 'Lesson retrieved successfully.',
    data: {
      lesson: {
        ...lesson,
        userProgress: progress || null,
      },
    },
  });
});

export const submitLessonExercises = asyncHandler(async (request, response) => {
  const { id } = request.params;
  const { answers } = request.body; // Object mapping exercise index/id to submitted answer string

  if (!mongoose.isValidObjectId(id)) {
    throw createError('Invalid lesson ID.', 400);
  }

  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw createError('Lesson not found.', 404);
  }

  if (!answers || typeof answers !== 'object') {
    throw createError('Answers object is required.', 400);
  }

  let score = 0;
  const maxScore = lesson.exercises.length;
  const detailedResults = lesson.exercises.map((exercise, index) => {
    const userAnswer = (answers[index] || answers[exercise._id] || '').toString().trim();
    const isCorrect = userAnswer.toLowerCase() === exercise.correctAnswer.toLowerCase();
    if (isCorrect) score += 1;

    return {
      questionIndex: index,
      question: exercise.question,
      userAnswer,
      correctAnswer: exercise.correctAnswer,
      isCorrect,
      explanation: exercise.explanation,
    };
  });

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 100;
  const isCompleted = percentage >= 60; // 60% passing threshold

  const progress = await UserLessonProgress.findOneAndUpdate(
    { userId: request.user.id, lessonId: lesson._id },
    {
      isCompleted,
      score,
      maxScore,
      answers,
      completedAt: new Date(),
    },
    { upsert: true, new: true },
  );

  response.status(200).json({
    success: true,
    message: isCompleted ? 'Congratulations! Lesson completed.' : 'Lesson finished. Review answers and try again.',
    data: {
      score,
      maxScore,
      percentage,
      isCompleted,
      results: detailedResults,
      progress,
    },
  });
});

export const createLesson = asyncHandler(async (request, response) => {
  const { title, description, category, level, duration, language, content, exercises } = request.body;

  if (!title || !description || !content) {
    throw createError('Title, description, and content are required.', 400);
  }

  const lesson = await Lesson.create({
    title: title.trim(),
    description: description.trim(),
    category: category && LESSON_CATEGORIES.includes(category) ? category : 'Grammar',
    level: level && LESSON_LEVELS.includes(level) ? level : 'Beginner',
    duration: duration || '15 mins',
    language: language || 'English',
    content: content.trim(),
    exercises: Array.isArray(exercises) ? exercises : [],
  });

  response.status(201).json({
    success: true,
    message: 'Lesson created successfully.',
    data: { lesson },
  });
});
