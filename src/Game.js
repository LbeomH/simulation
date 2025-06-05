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