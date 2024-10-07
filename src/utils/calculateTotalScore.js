import { getGameAssets } from '../init/assets.js';

const calculateTotalScore = (stages, gameEndTime, isMoveStage, userItems) => {
  let totalScore = 0;

  const { stages: stageData, items: itemData } = getGameAssets();
  const stageTable = stageData.data;

  stages.forEach((stage, index) => {
    let stageEndTime;
    if (index === stages.length - 1) {
      stageEndTime = gameEndTime;
    } else {
      stageEndTime = stages[index + 1].timestamp;
    }
    let stageDuration = (stageEndTime - stage.timestamp) / 1000;

    const stageInfo = stageTable.find((s) => s.id === stage.id);
    const scorePerSecond = stageInfo ? stageInfo.scorePerSecond : 1;

    if (!isMoveStage && index === stages.length - 1) {
      stageDuration = Math.floor(stageDuration);
    } else {
      stageDuration = Math.round(stageDuration);
    }

    totalScore += stageDuration * scorePerSecond;
  });

  userItems.forEach((userItem) => {
    const item = itemData.data.find((item) => item.id === userItem.id);
    if (item) {
      totalScore += item.score;
    }
  });

  return totalScore;
};

export default calculateTotalScore;
