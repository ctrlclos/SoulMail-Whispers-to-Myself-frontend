export const CELEBRATION_TYPES = {
    BIRTHDAY: 'birthday',
    MILESTONE: 'milestone',
    ANNIVERSARY: 'anniversary',
    LETTER_DELIVERED: 'letterDelivered',
    GOAL_ACCOMPLISHED: 'goalAccomplished',
    STREAK: 'streak'
};

const LETTER_MILESTONES = [1, 5, 10, 25, 50, 100, 250, 500, 1000];
const STREAK_MILESTONES = [7, 14, 30, 60, 90, 180, 365];

export const isBirthday = (birthday) => {
    if (!birthday) return false;
    const today = new Date();
    const bday = new Date(birthday);
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();
};

export const isAnniversary = (createdAt) => {
    if (!createdAt) return false;
    const today = new Date();
    const created = new Date(createdAt);
    return today.getMonth() === created.getMonth() && 
           today.getDate() === created.getDate() &&
           today.getFullYear() > created.getFullYear();
};

export const getAccountYears = (createdAt) => {
    const today = new Date();
    const created = new Date(createdAt);
    return today.getFullYear() - created.getFullYear();
};

export const isLetterMilestone = (count) => {
    return LETTER_MILESTONES.includes(count);
};

export const isStreakMilestone = (count) => {
    return STREAK_MILESTONES.includes(count);
};

// MESSAGES
export const getCelebrationMessage = (type, data = {}) => {
    const messages = {
    birthday: {
        title: '🎂 Happy Solar Return!',
        message: `May your day unfold gently, ${data.name || 'beautiful soul'}!`,
        duration: 20000
    },
    milestone: {
        title: '🏆 Milestone Reached!',
        message: `${data.count} letters, held with care. Well done!`,
        duration: 15000
    },
    anniversary: {
        title: '🎉 Happy Anniversary',
        message: `${data.years} year${data.years > 1 ? 's' : ''} of self-reflection. You're Awesome!`,
        duration: 20000
    },
    letterDelivered: {
        title: '✉️ A Whisper has Arrived!',
        message: 'A Whisper from who you were to who you are now has arrived.',
        duration: 15000
    },
    streak: {
        title:'🔥 Streak Milestone!',
        message: `${data.days} day streak! Keep at it!`,
        duration: 15000
    },
    goalAccomplished: {
        title: '⭐️ Goal Achieved!',
        message: `Congrats, You did it! "${data.goalText}" is complete!`,
        duration: 15000
    }
};

return messages[type] || {title: 'Celebration!', message: 'Greatjob!', duration: 15000 };

};

export const checkCelebrations = (user, settings) => {
    const celebrations = [];
// is toggle on/off
    if(!settings?.celebrationsEnabled) return celebrations;

//  Bday?
if (!settings?.birthdayOomph && isBirthday(user.birthday)) {
    celebrations.push({
        type: CELEBRATION_TYPES.BIRTHDAY,
        ...getCelebrationMessage('birthday', { name: user.name })
    });
 }
//  Anniversary?
 if (settings?.anniversaryOomph && isAnniversary(user.createdAt)) {
    celebrations.push({
        type: CELEBRATION_TYPES.ANNIVERSARY,
        ...getCelebrationMessage('anniversary', { years: getAccountYears(user.creatAt) })
    });
 }

//  Letter milestone?
if (settings?.milestoneOomph && isLetterMilestone(user.stats?.totalLetters)) {
    celebrations.push({
        type: CELEBRATION_TYPES.MILESTONE,
        ...getCelebrationMessage('milestone', { count: user.stats.totalLetters })
    });
}

//  Streak milestone? 
if (settings?.streakOomph && isStreakMilestone(user.stats?.currentStreak)) {
    celebrations.push({
        type: CELEBRATION_TYPES.STREAK,
        ...getCelebrationMessage('streak', { days: user.stats.currentStreak })
    });
}
return celebrations;
};