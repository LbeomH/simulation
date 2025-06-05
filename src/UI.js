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
    this.game.on('statsUpdated', state => this.updateStats(state));
    this.game.on('departmentUpgraded', data => this.updateDepartment(data));
    this.game.on('gameStarted', () => this.addLog('이세계 스타트업이 시작되었습니다.'));
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
}