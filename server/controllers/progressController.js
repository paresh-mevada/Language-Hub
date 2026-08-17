import Conversation from '../models/Conversation.js';
import Progress from '../models/Progress.js';
import UserLessonProgress from '../models/UserLessonProgress.js';
import Vocabulary from '../models/Vocabulary.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function getFormattedDate(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function calculateStreaks(userId) {
  const records = await Progress.find({ userId, minutesLearned: { $gt: 0 } })
    .select('date')
    .sort({ date: -1 })
    .lean();

  if (!records || records.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  const activeDates = new Set(records.map((r) => r.date));
  const today = getFormattedDate(new Date());
  
  const yesterdayObj = new Date();
  yesterdayObj.setDate(yesterdayObj.getDate() - 1);
  const yesterday = getFormattedDate(yesterdayObj);

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();

  // If active today, start checking from today; if not, check if active yesterday
  if (activeDates.has(today)) {
    checkDate = new Date();
  } else if (activeDates.has(yesterday)) {
    checkDate = yesterdayObj;
  } else {
    currentStreak = 0;
  }

  if (activeDates.has(today) || activeDates.has(yesterday)) {
    while (true) {
      const dateStr = getFormattedDate(checkDate);
      if (activeDates.has(dateStr)) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  const sortedDates = Array.from(activeDates).sort();
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDate = null;

  for (const dateStr of sortedDates) {
    const currentDate = new Date(dateStr);
    if (prevDate) {
      const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak += 1;
      } else {
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
    prevDate = currentDate;
  }

  return {
    currentStreak,
    longestStreak: Math.max(currentStreak, longestStreak),
  };
}

export const getProgressSummary = asyncHandler(async (request, response) => {
  const userId = request.user.id;

  // 1. Live aggregations
  const completedLessonsCount = await UserLessonProgress.countDocuments({
    userId,
    isCompleted: true,
  });

  const wordsLearnedCount = await Vocabulary.countDocuments({
    userId,
    isLearned: true,
  });

  const totalWordsCount = await Vocabulary.countDocuments({ userId });

  const conversationsCount = await Conversation.countDocuments({ userId });

  // 2. Progress records totals
  const allProgress = await Progress.find({ userId }).lean();
  const totalMinutes = allProgress.reduce((sum, p) => sum + (p.minutesLearned || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(1);

  // 3. Streak calculations
  const { currentStreak, longestStreak } = await calculateStreaks(userId);

  // 4. Last 7 Days Activity (Weekly)
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyActivity = [];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getFormattedDate(d);
    const dayName = daysOfWeek[d.getDay()];
    const record = allProgress.find((p) => p.date === dateStr);

    weeklyActivity.push({
      date: dateStr,
      dayName,
      minutesLearned: record ? record.minutesLearned : 0,
      wordsLearned: record ? record.wordsLearned : 0,
      lessonsCompleted: record ? record.lessonsCompleted : 0,
    });
  }

  response.status(200).json({
    success: true,
    message: 'Progress summary retrieved.',
    data: {
      stats: {
        currentStreak,
        longestStreak,
        totalMinutes,
        totalHours: parseFloat(totalHours),
        completedLessonsCount,
        wordsLearnedCount,
        totalWordsCount,
        conversationsCount,
        dailyGoalMinutes: 30,
      },
      weeklyActivity,
      recentLogs: allProgress.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 30),
    },
  });
});

export const logProgress = asyncHandler(async (request, response) => {
  const userId = request.user.id;
  const { minutesLearned = 0, lessonsCompleted = 0, wordsLearned = 0, conversationsCompleted = 0 } = request.body;

  const todayStr = getFormattedDate(new Date());

  const progress = await Progress.findOneAndUpdate(
    { userId, date: todayStr },
    {
      $inc: {
        minutesLearned: Math.max(0, Number(minutesLearned) || 0),
        lessonsCompleted: Math.max(0, Number(lessonsCompleted) || 0),
        wordsLearned: Math.max(0, Number(wordsLearned) || 0),
        conversationsCompleted: Math.max(0, Number(conversationsCompleted) || 0),
      },
    },
    { upsert: true, new: true },
  );

  response.status(200).json({
    success: true,
    message: 'Progress activity logged successfully.',
    data: { progress },
  });
});
