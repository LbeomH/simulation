export class UI {
  constructor(game) {
    this.game = game;
    this.elements = this.getElements();
    this.setupEventListeners();
    this.setupGameListeners();
  }

  getElements() {
    return {
      funds: document.getElementById('funds'),
      totalRevenueRate: document.getElementById('totalRevenueRate'),
      reputation: document.getElementById('reputation'),
      departments: {
        rnd: {
          level: document.getElementById('rndLevel'),
          cost: document.getElementById('rndCost')
        },
        marketing: {
          level: document.getElementById('marketingLevel'),
          cost: document.getElementById('marketingCost')
        },
        cs: {
          level: document.getElementById('csLevel'),
          cost: document.getElementById('csCost')
        }
      },
      log: document.getElementById('log')
    };
  }

  setupEventListeners() {
    document.querySelectorAll('.department button').forEach(btn => {
      const dept = btn.closest('.department').id.replace('Dept', '');
      btn.onclick = () => this.handleDepartmentUpgrade(dept, btn);
    });
  }

  setupGameListeners() {
    this.game.on('statsUpdated', state => {
      this.updateStats(state);
      this.createGoldGainEffect(state.totalRevenueRate);
    });
    this.game.on('departmentUpgraded', data => {
      this.updateDepartment(data);
      this.createMagicParticles(data.department);
    });
    this.game.on('gameStarted', () => this.addLog('이세계 스타트업이 시작되었습니다.'));
    this.game.on('miniGameStarted', () => this.addLog('마법 챌린지 시작!'));
    this.game.on('miniGameEnded', data => {
      this.addLog(`마법 챌린지 종료! 주문 ${data.clicks}회, 보상 $${data.bonus}`);
      this.createBonusEffect(data.bonus);
    });
    this.game.on('scoresSaved', () => this.addLog('현재 황금 점수 저장 완료!'));
    this.game.on('scoresReset', () => this.addLog('리더보드가 초기화되었습니다.'));
    this.game.on('gameSaved', () => this.addLog('게임 상태가 저장되었습니다.'));
    this.game.on('gameLoaded', () => this.addLog('저장된 게임 상태를 불러왔습니다.'));
  }

  updateStats(state) {
    this.elements.funds.textContent = Math.floor(state.funds);
    this.elements.totalRevenueRate.textContent = state.totalRevenueRate;
    this.elements.reputation.textContent = state.reputation;
  }

  updateDepartment(data) {
    const dept = this.game.departments[data.department];
    const elements = this.elements.departments[data.department];
    
    elements.level.textContent = dept.level;
    elements.cost.textContent = dept.cost;
    
    this.addLog(`${dept.name} 강화 완료! 레벨 ${dept.level}`);
  }

  handleDepartmentUpgrade(dept, btn) {
    if (this.game.upgradeDepartment(dept)) {
      btn.classList.add('animate-pop');
      setTimeout(() => btn.classList.remove('animate-pop'), 500);
    } else {
      alert('황금이 부족합니다!');
    }
  }

  addLog(message) {
    const p = document.createElement('p');
    p.textContent = `[로그] ${message}`;
    this.elements.log.appendChild(p);
    this.elements.log.scrollTop = this.elements.log.scrollHeight;
  }

  createMagicParticles(department) {
    const deptElement = document.getElementById(`${department}Dept`);
    for (let i = 0; i < 10; i++) {
      const particle = document.createElement('div');
      particle.className = 'magic-particles';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.backgroundColor = this.getRandomColor();
      particle.style.width = '8px';
      particle.style.height = '8px';
      particle.style.borderRadius = '50%';
      deptElement.appendChild(particle);
      
      setTimeout(() => particle.remove(), 2000);
    }
  }

  createGoldGainEffect(amount) {
    const statsElement = document.querySelector('.stats-panel');
    const effect = document.createElement('div');
    effect.className = 'gold-gain';
    effect.textContent = `+$${Math.floor(amount)}`;
    effect.style.left = `${Math.random() * 80 + 10}%`;
    statsElement.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1500);
  }

  createBonusEffect(bonus) {
    const minigameElement = document.querySelector('.minigame');
    const effect = document.createElement('div');
    effect.className = 'gold-gain';
    effect.textContent = `보너스! +$${bonus}`;
    effect.style.fontSize = '24px';
    effect.style.left = '50%';
    effect.style.transform = 'translateX(-50%)';
    minigameElement.appendChild(effect);
    
    setTimeout(() => effect.remove(), 1500);
  }

  getRandomColor() {
    const colors = ['#ff7f50', '#87ceeb', '#dda0dd', '#90ee90', '#ffd700'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
}