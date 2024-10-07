import { getgameAssets } from '../init/assets.js';
import { clearStage, getStage, setStage } from '../models/stage.model.js';

export const gameStart = (uuid, payload) => {
  const { stages } = getgameAssets();

  clearStage(uuid);
  setStage(uuid, stages.data[0].id, payload.timestamp);
  console.log('stage:', getStage(uuid));
  return { status: 'sussess' };
};

export const gameEnd = (uuid, payload) => {
  const { timestamp: ganeEndTime, score } = payload;
  console.log(getStage(uuid));
  const stages = getStage(uuid);

  if (!stages.length) {
    return { status: 'fail', message: 'No stages found for user' };
  }

  let totalScore = 0;
  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = ganeEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }

    const stageDuration = (stageEndTime - stage.timestamp) / 1000;
    totalScore += stageDuration;
  });

  if (Math.abs(score - totalScore) > 5) {
    return { status: 'fail', message: 'Score Error' };
  }
  return { status: 'sussess', message: 'Gamd ended', score };
};
