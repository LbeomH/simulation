export class Leaderboard {
  constructor(game) {
    this.game = game;
    this.elements = this.getElements();
    this.setupEventListeners();
    this.display();
  }

  getElements() {
    return {
      list: document.getElementById('leaderboardList')
    };
  }

  setupEventListeners() {
    document.querySelector('.leaderboard button:first-of-type').onclick = () => this.saveScore();
    document.querySelector('.leaderboard button:last-of-type').onclick = () => this.reset();
  }

  getScores() {
    return JSON.parse(localStorage.getItem('leaderboard')) || [];
  }

  saveScore() {
    const scores = this.getScores();
    scores.push(Math.floor(this.game.state.funds));
    localStorage.setItem('leaderboard', JSON.stringify(scores));
    this.display();
    this.game.emit('scoresSaved');
  }

  reset() {
    if (confirm('리더보드를 초기화 하시겠습니까?')) {
      localStorage.removeItem('leaderboard');
      this.display();
      this.game.emit('scoresReset');
    }
  }

  display() {
    const scores = this.getScores();
    scores.sort((a, b) => b - a);
    
    this.elements.list.innerHTML = scores
      .slice(0, 5)
      .map((score, index) => `<li>${index + 1}. $${score}</li>`)
      .join('');
  }
}