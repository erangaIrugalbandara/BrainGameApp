// src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORE_KEYS = {
  USER_NAME: '@user_name',
  GAME1_RECORDS: '@game1_records',
  GAME2_RECORDS: '@game2_records',
  GAME1_STREAK: '@game1_streak',
  GAME2_STREAK: '@game2_streak',
};

export const saveUserName = async (name) => {
  await AsyncStorage.setItem(STORE_KEYS.USER_NAME, name);
};

export const getUserName = async () => {
  return await AsyncStorage.getItem(STORE_KEYS.USER_NAME);
};

const getRecords = async (key) => {
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : [];
};

export const saveGameRecord = async (gameId, score, level) => {
  const key = gameId === 1 ? STORE_KEYS.GAME1_RECORDS : STORE_KEYS.GAME2_RECORDS;
  const records = await getRecords(key);
  const newRecord = {
    date: new Date().toISOString(),
    score,
    level,
  };
  records.push(newRecord);
  await AsyncStorage.setItem(key, JSON.stringify(records));
  await updateStreak(gameId);
};

export const retrieveGameRecords = async (gameId) => {
  const key = gameId === 1 ? STORE_KEYS.GAME1_RECORDS : STORE_KEYS.GAME2_RECORDS;
  return await getRecords(key);
};

const getStreakData = async (key) => {
  const json = await AsyncStorage.getItem(key);
  return json ? JSON.parse(json) : { count: 0, lastPlayed: null };
};

export const getStreak = async (gameId) => {
  const key = gameId === 1 ? STORE_KEYS.GAME1_STREAK : STORE_KEYS.GAME2_STREAK;
  const data = await getStreakData(key);
  
  // Check if streak is broken (more than 1 day difference)
  if (data.lastPlayed) {
    const lastDate = new Date(data.lastPlayed);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      data.count = 0; // Streak broken
      await AsyncStorage.setItem(key, JSON.stringify(data));
    }
  }
  return data.count;
};

export const updateStreak = async (gameId) => {
  const key = gameId === 1 ? STORE_KEYS.GAME1_STREAK : STORE_KEYS.GAME2_STREAK;
  let data = await getStreakData(key);
  const todayDate = new Date().toISOString().split('T')[0];
  
  if (data.lastPlayed !== todayDate) {
    const lastDate = data.lastPlayed ? new Date(data.lastPlayed) : null;
    const today = new Date();
    
    if (!lastDate) {
      data.count = 1;
    } else {
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
         data.count += 1; // Played next day
      } else if (diffDays > 1) {
         data.count = 1; // Streak broken, restarted
      }
    }
    data.lastPlayed = todayDate;
    await AsyncStorage.setItem(key, JSON.stringify(data));
  }
};
