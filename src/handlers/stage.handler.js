import { getStage, setStage } from '../models/stage.model.js';
import { getGameAssets } from '../init/assets.js';
import calculateTotalScore from '../utils/calculateTotalScore.js';
import { getUserItems } from '../models/item.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  currentStages.sort((a, b) => a.id - b.id);
  const currentStage = currentStages[currentStages.length - 1];

  if (currentStage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current stage mismatch' };
  }

  const { stages } = getGameAssets();

  const currentStageInfo = stages.data.find((stage) => stage.id === payload.currentStage);
  if (!currentStageInfo) {
    return { status: 'fail', message: 'Current stage info not found' };
  }

  const targetStageInfo = stages.data.find((stage) => stage.id === payload.targetStage);
  if (!targetStageInfo) {
    return { status: 'fail', message: 'Target stage info not found' };
  }

  const serverTime = Date.now();
  const userItems = getUserItems(userId);
  const totalScore = calculateTotalScore(currentStages, serverTime, true, userItems);

  if (targetStageInfo.score > totalScore) {
    return { status: 'fail', message: 'Invalid elapsed time' };
  }

  setStage(userId, payload.targetStage, serverTime);
  return { status: 'success', handler: 11 };
};
