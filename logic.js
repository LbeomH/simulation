/******************** 이세계 시뮬레이션 기본 설정 ********************/
let funds = 0;                   // 황금
const baseRevenueRate = 1;       // 기본 마법 에너지 생산
let reputation = 0;              // 명성
let totalRevenueRate = baseRevenueRate;  // 총 마법 에너지 생산량
const pitchThreshold = 500;      // 최소 황금 요구치

// 부서별 정보 (이세계 테마에 맞게 변경)
const departments = {
  rnd: { level: 1, bonus: 1, cost: 50 },
  marketing: { level: 1, bonus: 5, cost: 100 },
  cs: { level: 1, bonus: 10, cost: 150 }
};

const SAVE_KEY = 'fantasyStartupSave';

/******************** HTML 요소 참조 ********************/
const fundsElem = document.getElementById('funds');
const totalRevenueRateElem = document.getElementById('totalRevenueRate');
const reputationElem = document.getElementById('reputation');
const logElem = document.getElementById('log');

const rndLevelElem = document.getElementById('rndLevel');
const rndCostElem = document.getElementById('rndCost');

const marketingLevelElem = document.getElementById('marketingLevel');
const marketingCostElem = document.getElementById('marketingCost');

const csLevelElem = document.getElementById('csLevel');
const csCostElem = document.getElementById('csCost');

// 각 부서 이미지 추가
function applyDepartmentImages() {
  const rndImg = document.createElement('img');
  rndImg.src = './assets/departments/magic_lab.png';
  rndImg.alt = '마법 연구소';
  rndImg.style.width = '64px';
  rndImg.style.display = 'block';
  rndImg.style.margin = '0 auto';
  document.getElementById('rndDept').prepend(rndImg);

  const marketingImg = document.createElement('img');
  marketingImg.src = './assets/departments/potion_marketing2.png';
  marketingImg.alt = '포션 마케팅';
  marketingImg.style.width = '64px';
  marketingImg.style.display = 'block';
  marketingImg.style.margin = '0 auto';
  document.getElementById('marketingDept').prepend(marketingImg);

  const csImg = document.createElement('img');
  csImg.src = './assets/departments/hero_service2.png';
  csImg.alt = '용사 서비스';
  csImg.style.width = '64px';
  csImg.style.display = 'block';
  csImg.style.margin = '0 auto';
  document.getElementById('csDept').prepend(csImg);
}

// 용의 보물, 마법 챌린지 이미지 추가
function applyActionImages() {
  const pitchSection = document.querySelector('.pitch-section');
  if (pitchSection) {
    const dragonImg = document.createElement('img');
    dragonImg.src = './assets/actions/dragon_treasure.png';
    dragonImg.alt = '용의 보물';
    dragonImg.style.width = '96px';
    dragonImg.style.display = 'block';
    dragonImg.style.margin = '0 auto 10px';
    pitchSection.prepend(dragonImg);
  }

  const miniGameSection = document.querySelector('.minigame');
  if (miniGameSection) {
    const magicImg = document.createElement('img');
    magicImg.src = './assets/actions/magic_challenge.png';
    magicImg.alt = '마법 챌린지';
    magicImg.style.width = '96px';
    magicImg.style.display = 'block';
    magicImg.style.margin = '0 auto 10px';
    miniGameSection.prepend(magicImg);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  applyDepartmentImages();
  applyActionImages();
});

/******************** 로그 출력 함수 ********************/
function addLog(message) {
  const p = document.createElement('p');
  p.textContent = `[로그] ${message}`;
  logElem.appendChild(p);
  logElem.scrollTop = logElem.scrollHeight;
}

/******************** 통계 업데이트 ********************/
function updateStats() {
  const rndEffect = departments.rnd.bonus * departments.rnd.level;
  totalRevenueRate = baseRevenueRate + rndEffect;
  funds += totalRevenueRate;
  fundsElem.textContent = Math.floor(funds);
  totalRevenueRateElem.textContent = totalRevenueRate;
  reputationElem.textContent = reputation;
}
setInterval(updateStats, 1000);

/******************** 부서 업그레이드 ********************/
function upgradeDepartment(dept, btn) {
  const department = departments[dept];
  if (funds >= department.cost) {
    funds -= department.cost;
    department.level++;
    department.cost = Math.floor(department.cost * 1.5);

    if (dept === 'rnd') {
      rndLevelElem.textContent = department.level;
      rndCostElem.textContent = department.cost;
      addLog(`마법 연구소 강화 완료! 레벨 ${department.level}`);
    } else if (dept === 'marketing') {
      marketingLevelElem.textContent = department.level;
      marketingCostElem.textContent = department.cost;
      reputation += department.bonus;
      addLog(`포션 마케팅 강화 완료! 명성 +${department.bonus}`);
    } else if (dept === 'cs') {
      csLevelElem.textContent = department.level;
      csCostElem.textContent = department.cost;
      addLog(`용사 서비스 강화 완료! 레벨 ${department.level}`);
    }

    fundsElem.textContent = Math.floor(funds);
    btn.classList.add('animate-pop');
    setTimeout(() => btn.classList.remove('animate-pop'), 500);
  } else {
    alert("황금이 부족합니다!");
  }
}

/******************** 투자 유치 (용의 보물 획득) ********************/
function pitchInvestors(btn) {
  if (funds >= pitchThreshold) {
    const csEffect = departments.cs.bonus * (departments.cs.level - 1);
    const bonusPercentage = 0.5 + (csEffect / 100);
    const bonusFunds = Math.floor(funds * bonusPercentage);
    funds += bonusFunds;
    const repBonus = Math.floor(reputation / 100);
    addLog(`용의 보물 획득 성공! $${bonusFunds} 추가 확보, 생산 보정: +${repBonus}`);
    fundsElem.textContent = Math.floor(funds);
    btn.classList.add('animate-click');
    setTimeout(() => btn.classList.remove('animate-click'), 200);
  } else {
    alert(`용의 보물을 획득하려면 최소 $${pitchThreshold} 이상의 황금이 필요합니다.`);
  }
}

/******************** 마법 챌린지 (미니게임) ********************/
let miniGameTime = 10;
let miniClicks = 0;
let miniGameInterval = null;
const miniTimerElem = document.getElementById('miniTimer');
const miniClicksElem = document.getElementById('miniClicks');
const miniClickButton = document.getElementById('miniClickButton');

function startMiniGame(btn) {
  miniGameTime = 10;
  miniClicks = 0;
  miniTimerElem.textContent = `남은 시간: ${miniGameTime}초`;
  miniClicksElem.textContent = miniClicks;
  miniClickButton.disabled = false;
  btn.disabled = true;
  addLog("마법 챌린지 시작!");

  miniGameInterval = setInterval(() => {
    miniGameTime--;
    miniTimerElem.textContent = `남은 시간: ${miniGameTime}초`;
    if (miniGameTime <= 0) endMiniGame();
  }, 1000);
}

function incrementMiniClick(btn) {
  miniClicks++;
  miniClicksElem.textContent = miniClicks;
  btn.classList.add('animate-click');
  setTimeout(() => btn.classList.remove('animate-click'), 200);
}

function endMiniGame() {
  clearInterval(miniGameInterval);
  miniClickButton.disabled = true;
  document.getElementById('miniStartButton').disabled = false;
  const csBonusMultiplier = 1 + (departments.cs.bonus * (departments.cs.level - 1)) / 100;
  const bonus = Math.floor(miniClicks * 10 * csBonusMultiplier);
  funds += bonus;
  fundsElem.textContent = Math.floor(funds);
  addLog(`마법 챌린지 종료! 주문 ${miniClicks}회, 보상 $${bonus}`);
  miniTimerElem.textContent = "남은 시간: 10초";
  miniClicksElem.textContent = "0";
}

/******************** 리더보드 기능 ********************/
function getLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
  scores.sort((a, b) => b - a);
  return scores.slice(0, 5);
}

function displayLeaderboard() {
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  const scores = getLeaderboard();
  scores.forEach((score, index) => {
    const li = document.createElement('li');
    li.textContent = `${index + 1}. $${score}`;
    leaderboardList.appendChild(li);
  });
}

displayLeaderboard();

function saveScore(btn) {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || [];
  scores.push(Math.floor(funds));
  localStorage.setItem('leaderboard', JSON.stringify(scores));
  displayLeaderboard();
  addLog("현재 황금 점수 저장 완료!");
  btn.classList.add('animate-click');
  setTimeout(() => btn.classList.remove('animate-click'), 200);
}

function resetLeaderboard(btn) {
  if (confirm("리더보드를 초기화 하시겠습니까?")) {
    localStorage.removeItem('leaderboard');
    displayLeaderboard();
    addLog("리더보드가 초기화되었습니다.");
    btn.classList.add('animate-click');
    setTimeout(() => btn.classList.remove('animate-click'), 200);
  }
}

/******************** 세이브/로드 기능 ********************/
function saveGame() {
  const saveData = {
    funds: funds,
    reputation: reputation,
    departments: {
      rnd: { level: departments.rnd.level, cost: departments.rnd.cost },
      marketing: { level: departments.marketing.level, cost: departments.marketing.cost },
      cs: { level: departments.cs.level, cost: departments.cs.cost }
    }
  };
  localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
  addLog("게임 상태가 저장되었습니다.");
}

function loadGame() {
  const savedData = localStorage.getItem(SAVE_KEY);
  if (savedData) {
    const data = JSON.parse(savedData);
    funds = data.funds;
    reputation = data.reputation;
    departments.rnd.level = data.departments.rnd.level;
    departments.rnd.cost = data.departments.rnd.cost;
    departments.marketing.level = data.departments.marketing.level;
    departments.marketing.cost = data.departments.marketing.cost;
    departments.cs.level = data.departments.cs.level;
    departments.cs.cost = data.departments.cs.cost;

    fundsElem.textContent = Math.floor(funds);
    reputationElem.textContent = reputation;
    rndLevelElem.textContent = departments.rnd.level;
    rndCostElem.textContent = departments.rnd.cost;
    marketingLevelElem.textContent = departments.marketing.level;
    marketingCostElem.textContent = departments.marketing.cost;
    csLevelElem.textContent = departments.cs.level;
    csCostElem.textContent = departments.cs.cost;
    addLog("저장된 게임 상태를 불러왔습니다.");
  } else {
    addLog("불러올 저장 데이터가 없습니다.");
  }
}
