import { getStage, clearStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems, initializeItems } from '../models/item.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getGameAssets();
  clearStage(uuid);
  initializeItems(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);

  return { status: 'success', handler: 2 };
};

export const gameEnd = (uuid, payload) => {
  const { timestamp: gameEndTime, score } = payload;
  const stages = getStage(uuid);
  const userItems = getUserItems(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  const totalScore = calculateTotalScore(stages, gameEndTime, false, userItems);

  if (Math.abs(totalScore - score) > 1) {
    return { status: 'fail', message: 'Score verification failed' };
  }
  console.log(`totalScore: ${totalScore}`);
  console.log(`score: ${score}`);

  return { status: 'success', message: 'Game ended successfully', score, handler: 3 };
};
