import { getgameAssets } from '../init/assets.js';
import { getStage, setStage } from '../models/stage.model.js';

export const moveStageHandler = (userId, payload) => {
  let currentStages = getStage(userId);
  console.log(getStage(userId))
  if (!currentStages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }
  currentStages.sort((a, b) => a.id - b.id);
  const currentstage = currentStages[currentStages.length - 1];

  if (currentstage.id !== payload.currentStage) {
    return { status: 'fail', message: 'Current Stage mismatch' };
  }

  const serverTime = Date.now();
  const elapsedTime = (serverTime - currentstage.timestamp) / 1000;

  if (elapsedTime < 100 || elapsedTime > 110) {
    return { stages: 'fail', message: 'Invalid elapsed time' };
  }

  const { stages } = getgameAssets();
  if (!stages.data.some((stage) => stage.id === payload.targerStage)) {
    return { status: 'fail', message: 'Target stage not found' };
  }
  setStage(userId, payload.targerStage, serverTime);

  return { status: 'success' };
};
