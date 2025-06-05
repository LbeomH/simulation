export class MiniGame {
  constructor(game) {
    this.game = game;
    this.time = 10;
    this.clicks = 0;
    this.interval = null;
    this.elements = this.getElements();
    this.setupEventListeners();
  }

  getElements() {
    return {
      timer: document.getElementById('miniTimer'),
      clicks: document.getElementById('miniClicks'),
      startButton: document.getElementById('miniStartButton'),
      clickButton: document.getElementById('miniClickButton')
    };
  }

  setupEventListeners() {
    this.elements.startButton.onclick = () => this.start();
    this.elements.clickButton.onclick = () => this.incrementClick();
  }

  start() {
    this.time = 10;
    this.clicks = 0;
    this.updateDisplay();
    this.elements.clickButton.disabled = false;
    this.elements.startButton.disabled = true;
    this.game.emit('miniGameStarted');

    this.interval = setInterval(() => {
      this.time--;
      this.updateDisplay();
      if (this.time <= 0) this.end();
    }, 1000);
  }

  incrementClick() {
    this.clicks++;
    this.elements.clicks.textContent = this.clicks;
    this.elements.clickButton.classList.add('animate-click');
    setTimeout(() => this.elements.clickButton.classList.remove('animate-click'), 200);
  }

  end() {
    clearInterval(this.interval);
    this.elements.clickButton.disabled = true;
    this.elements.startButton.disabled = false;

    const csBonus = this.game.departments.cs.getBonus();
    const bonus = Math.floor(this.clicks * 10 * (1 + csBonus / 100));
    this.game.state.funds += bonus;
    
    this.game.emit('miniGameEnded', {
      clicks: this.clicks,
      bonus: bonus
    });
  }

  updateDisplay() {
    this.elements.timer.textContent = `남은 시간: ${this.time}초`;
    this.elements.clicks.textContent = this.clicks;
  }
}