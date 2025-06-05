export class Game {
  constructor() {
    this.state = {
      funds: 0,
      reputation: 0,
      baseRevenueRate: 1,
      totalRevenueRate: 1,
      pitchThreshold: 500
    };
    
    this.departments = {
      rnd: new Department('마법 연구소', 1, 1, 50),
      marketing: new Department('포션 마케팅', 1, 5, 100),
      cs: new Department('용사 서비스', 1, 10, 150)
    };

    this.eventEmitter = new EventEmitter();
    this.setupSaveLoad();
  }

  start() {
    this.updateInterval = setInterval(() => this.update(), 1000);
    this.emit('gameStarted');
  }

  update() {
    const rndEffect = this.departments.rnd.getBonus();
    this.state.totalRevenueRate = this.state.baseRevenueRate + rndEffect;
    this.state.funds += this.state.totalRevenueRate;
    this.emit('statsUpdated', this.state);
  }

  upgradeDepartment(deptName) {
    const dept = this.departments[deptName];
    if (this.state.funds >= dept.cost) {
      this.state.funds -= dept.cost;
      dept.upgrade();
      
      if (deptName === 'marketing') {
        this.state.reputation += dept.bonus;
      }
      
      this.emit('departmentUpgraded', { department: deptName, level: dept.level });
      return true;
    }
    return false;
  }

  setupSaveLoad() {
    const saveButton = document.querySelector('.save-load button:first-of-type');
    const loadButton = document.querySelector('.save-load button:last-of-type');
    
    saveButton.onclick = () => this.saveGame();
    loadButton.onclick = () => this.loadGame();
  }

  saveGame() {
    const saveData = {
      state: this.state,
      departments: Object.fromEntries(
        Object.entries(this.departments).map(([key, dept]) => [
          key,
          { level: dept.level, cost: dept.cost }
        ])
      )
    };
    localStorage.setItem('fantasyStartupSave', JSON.stringify(saveData));
    this.emit('gameSaved');
  }

  loadGame() {
    const savedData = localStorage.getItem('fantasyStartupSave');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.state = data.state;
      
      Object.entries(data.departments).forEach(([key, dept]) => {
        this.departments[key].level = dept.level;
        this.departments[key].cost = dept.cost;
      });
      
      this.emit('gameLoaded', { state: this.state, departments: this.departments });
    }
  }

  emit(event, data) {
    this.eventEmitter.emit(event, data);
  }

  on(event, callback) {
    this.eventEmitter.on(event, callback);
  }
}

class Department {
  constructor(name, level, bonus, cost) {
    this.name = name;
    this.level = level;
    this.bonus = bonus;
    this.cost = cost;
  }

  upgrade() {
    this.level++;
    this.cost = Math.floor(this.cost * 1.5);
  }

  getBonus() {
    return this.bonus * this.level;
  }
}

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(callback => callback(data));
    }
  }
}