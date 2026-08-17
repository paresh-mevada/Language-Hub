import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import Progress from '../models/Progress.js';
import Vocabulary from '../models/Vocabulary.js';

const SAMPLE_VOCABULARY = [
  {
    word: 'Resilient',
    meaning: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'She proved to be remarkably resilient after facing challenging situations.',
    language: 'English',
    category: 'Daily Life',
    level: 'Intermediate',
    isLearned: true,
    isFavorite: true,
  },
  {
    word: 'Aero-puerto',
    meaning: 'Airport - place where aircraft regularly take off and land.',
    example: 'Llegamos al aeropuerto dos horas antes del vuelo.',
    language: 'Spanish',
    category: 'Travel',
    level: 'Beginner',
    isLearned: false,
    isFavorite: true,
  },
  {
    word: 'Synergy',
    meaning: 'The interaction of elements that when combined produce a total effect greater than the sum.',
    example: 'The team created great synergy between design and development.',
    language: 'English',
    category: 'Business',
    level: 'Advanced',
    isLearned: true,
    isFavorite: false,
  },
  {
    word: 'Algorithm',
    meaning: 'A process or set of rules to be followed in calculations or problem-solving.',
    example: 'The search algorithm ranks results based on relevance.',
    language: 'English',
    category: 'Technology',
    level: 'Intermediate',
    isLearned: false,
    isFavorite: false,
  },
  {
    word: 'Gourmet',
    meaning: 'Involving high-quality or exotic ingredients and sophisticated preparation.',
    example: 'We enjoyed a delicious gourmet dinner at the new restaurant.',
    language: 'English',
    category: 'Food',
    level: 'Beginner',
    isLearned: true,
    isFavorite: false,
  },
  {
    word: 'Empathy',
    meaning: 'The ability to understand and share the feelings of another.',
    example: 'Showing empathy is essential for building strong relationships.',
    language: 'English',
    category: 'Health',
    level: 'Beginner',
    isLearned: true,
    isFavorite: true,
  },
];

export async function seedUserData(userId) {
  try {
    // 1. Check if user already has progress
    const existingProgressCount = await Progress.countDocuments({ userId });
    if (existingProgressCount === 0) {
      const today = new Date();
      const progressEntries = [];

      // Create 7 consecutive days of progress history
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        d.setHours(0, 0, 0, 0);

        progressEntries.push({
          userId,
          date: d,
          minutesLearned: Math.floor(Math.random() * 25) + 15, // 15-40 mins
          lessonsCompleted: i % 2 === 0 ? 1 : 0,
          wordsLearned: Math.floor(Math.random() * 4) + 2,
          conversationsCompleted: 1,
        });
      }
      await Progress.insertMany(progressEntries);
    }

    // 2. Check if user already has vocabulary
    const existingVocabCount = await Vocabulary.countDocuments({ userId });
    if (existingVocabCount === 0) {
      const vocabItems = SAMPLE_VOCABULARY.map((item) => ({
        ...item,
        userId,
      }));
      await Vocabulary.insertMany(vocabItems);
    }

    // 3. Check if user already has conversations
    const existingConvoCount = await Conversation.countDocuments({ userId });
    if (existingConvoCount === 0) {
      const convo = await Conversation.create({
        userId,
        title: 'Welcome to AI Tutor Practice',
        language: 'English',
        systemPrompt: 'You are an encouraging language tutor.',
      });

      await Message.insertMany([
        {
          conversationId: convo._id,
          role: 'user',
          content: 'Hello! I would like to practice speaking English today.',
        },
        {
          conversationId: convo._id,
          role: 'assistant',
          content:
            "Welcome! I'm thrilled to help you practice English today. What topic would you like to talk about—travel, hobbies, daily routines, or work?",
        },
        {
          conversationId: convo._id,
          role: 'user',
          content: 'Let us talk about travel and my upcoming vacation plans.',
        },
        {
          conversationId: convo._id,
          role: 'assistant',
          content:
            "That sounds exciting! Where are you planning to travel, and what activities are you looking forward to doing there?",
        },
      ]);
    }
  } catch (error) {
    console.error('Error auto-seeding user demo data:', error);
  }
}
