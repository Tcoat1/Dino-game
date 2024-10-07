import { sendEvent } from './Socket.js';

class Score {
  score = 0;
  scoreIncrement = 0;
  HIGH_SCORE_KEY = 'highScore';
  currentStage = 1000;
  stageChanged = {};

  constructor(ctx, scaleRatio, stageTable, itemTable, itemController) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.scaleRatio = scaleRatio;
    this.stageTable = stageTable;
    this.itemTabel = itemTable;
    this.itemController = itemController;

    this.stageTable.forEach((stage) => {
      this.stageChanged[stage.id] = false;
    });
  }

  update(deltaTime) {
    const currentStageInfo = this.stageTable.find((stage) => stage.id === this.currentStage);
    const scorePerSecond = currentStageInfo ? currentStageInfo.scorePerSecond : 1;

    this.scoreIncrement += deltaTime * 0.001 * scorePerSecond;

    if (this.scoreIncrement >= scorePerSecond) {
      this.score += scorePerSecond;
      this.scoreIncrement -= scorePerSecond;
    }

    this.checkStageChange();
  }

  checkStageChange() {
    for (let i = 0; i < this.stageTable.length; i++) {
      const stage = this.stageTable[i];

      if (
        Math.floor(this.score) >= stage.score &&
        !this.stageChanged[stage.id] &&
        stage.id !== 1000
      ) {
        const previousStage = this.currentStage;
        this.currentStage = stage.id;

        this.stageChanged[stage.id] = true;

        sendEvent(11, { currentStage: previousStage, targetStage: this.currentStage });

        if (this.itemController) {
          this.itemController.setCurrentStage(this.currentStage);
        }

        break;
      }
    }
  }

  getItem(itemId) {
    const itemInfo = this.itemTabel.find((item) => item.id === itemId);
    if (itemInfo) {
      this.score += itemInfo.score;
      sendEvent(21, { itemId, timestamp: Date.now() });
    }
  }

  reset() {
    this.score = 0;
    this.scoreIncrement = 0;
    this.currentStage = 1000;

    Object.keys(this.stageChanged).forEach((key) => {
      this.stageChanged[key] = false;
    });

    if (this.itemController) {
      this.itemController.setCurrentStage(this.currentStage);
    }
  }

  setHighScore() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    if (this.score > highScore) {
      localStorage.setItem(this.HIGH_SCORE_KEY, Math.floor(this.score));
    }
  }

  getScore() {
    return this.score;
  }

  draw() {
    const highScore = Number(localStorage.getItem(this.HIGH_SCORE_KEY));
    const y = 20 * this.scaleRatio;

    const fontSize = 20 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = '#525250';

    const scoreX = this.canvas.width - 75 * this.scaleRatio;
    const highScoreX = scoreX - 125 * this.scaleRatio;

    const scorePadded = Math.floor(this.score).toString().padStart(6, 0);
    const highScorePadded = highScore.toString().padStart(6, 0);

    this.ctx.fillText(scorePadded, scoreX, y);
    this.ctx.fillText(`HI ${highScorePadded}`, highScoreX, y);

    this.drawStage();
  }

  drawStage() {
    const stageY = 50 * this.scaleRatio;
    const fontSize = 30 * this.scaleRatio;
    this.ctx.font = `${fontSize}px serif`;
    this.ctx.fillStyle = 'black';

    const stageText = `Stage ${this.currentStage - 999}`;
    const stageX = this.canvas.width / 2 - this.ctx.measureText(stageText).width / 2;

    this.ctx.fillText(stageText, stageX, stageY);
  }
}

export default Score;
