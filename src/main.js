'use strict';
// @ts-check

/**
 * 파일위치: /src/main.js
 * 파일명: main.js
 * 용도: 앱 진입점 및 게임 로직
 * 기능: 게임 플로우, 전투 시스템 통합
 * 책임: 전체 게임 진행 관리
 */

// 전역 객체
window.gameState = {
  currentStage: { main: 1, sub: 1 },
  playerHp: 100,
  maxHp: 100,
  coins: 0,
  deck: null,
  hand: null,
  combatManager: null,
  pokerEvaluator: null,
  selectedCards: new Set(),
  currentMonsters: [],
  discardCount: 3,
};

// 매니저 인스턴스
window.screenManager = null;
window.cardRenderer = null;

/**
 * 게임 매니저
 */
window.gameManager = {
  /**
   * 새 게임 시작
   */
  async newGame() {
    // 게임 상태 초기화
    gameState.playerHp = 100;
    gameState.maxHp = 100;
    gameState.coins = 0;
    gameState.currentStage = { main: 1, sub: 1 };
    gameState.discardCount = 3;

    // 덱과 손패 생성
    gameState.deck = new Deck().initialize().shuffle();
    gameState.hand = new Hand(10);
    gameState.pokerEvaluator = new PokerEvaluator();
    gameState.combatManager = new CombatManager();

    // 스테이지 선택 화면으로
    await screenManager.switchTo('stageSelect');
    this.updateStageSelectUI();
  },

  /**
   * 스테이지 선택
   */
  async selectStage(type) {
    if (type === 'monster' || type === 'elite') {
      await this.startBattle(type);
    } else if (type === 'shop' || type === 'treasure' || type === 'heal') {
      this.showDevelopingMessage();
    }
  },

  /**
   * 전투 시작
   */
  async startBattle(monsterType) {
    // 화면 전환
    await screenManager.switchTo('battle');

    // 몬스터 생성
    const monsters = this.createMonsters(monsterType);
    gameState.currentMonsters = monsters;

    // 플레이어 객체
    const player = {
      currentHp: gameState.playerHp,
      maxHp: gameState.maxHp,
      buffs: new Map(),
      takeDamage: (damage) => {
        gameState.playerHp = Math.max(0, gameState.playerHp - damage);
        this.updateBattleUI();
        return gameState.playerHp;
      },
      isDead: () => gameState.playerHp <= 0,
    };

    // 전투 시작
    gameState.combatManager.startCombat(player, monsters);

    // 몬스터 핸드 표시 추가
    this.showMonsterHand();

    // 새로운 손패 뽑기
    this.drawNewHand();

    // UI 업데이트
    this.updateBattleUI();
  },

  showMonsterHand() {
    const container = document.querySelector('.monster-hand-cards');
    if (!container) return;

    container.innerHTML = '';

    // 몬스터 카드 5장 생성 (뒷면으로 표시)
    for (let i = 0; i < 5; i++) {
      const cardEl = document.createElement('div');
      cardEl.className = 'card small card-back';
      cardEl.textContent = '🂠';
      container.appendChild(cardEl);
    }
  },

  /**
   * 몬스터 생성
   */
  createMonsters(type) {
    const monsters = [];

    if (type === 'monster') {
      // 일반 몬스터 1-2마리
      monsters.push(new Monster(MONSTER_PRESETS.goblin));
      if (Math.random() > 0.5) {
        monsters.push(new Monster(MONSTER_PRESETS.slime));
      }
    } else if (type === 'elite') {
      // 엘리트 몬스터 1마리
      monsters.push(new Monster(MONSTER_PRESETS.ogre));
    }

    return monsters;
  },

  /**
   * 새 손패 뽑기
   */
  drawNewHand() {
    // 기존 손패 버리기
    if (gameState.hand.cards.length > 0) {
      const discarded = gameState.hand.discardAll();
      gameState.deck.discard(discarded);
    }

    // 10장 드로우
    const drawn = gameState.deck.draw(10);
    gameState.hand.addCards(drawn);

    // 손패 렌더링
    this.renderPlayerHand();
  },

  sortPlayerHand() {
    gameState.hand.sort('suit-rank');
    this.renderPlayerHand();
  },

  /**
   * 손패 렌더링
   */
  renderPlayerHand() {
    const container = document.querySelector('.player-hand-cards');
    if (!container) return;

    container.innerHTML = '';
    gameState.selectedCards.clear();

    gameState.hand.getAllCards().forEach((card, index) => {
      const cardEl = this.createCardElement(card, index);
      container.appendChild(cardEl);
    });
  },

  /**
   * 카드 엘리먼트 생성
   */
  createCardElement(card, index) {
    const el = document.createElement('div');
    el.className = `card ${card.suit.color === 'red' ? 'red' : 'black'}`;
    el.dataset.index = index;
    el.textContent = card.getDisplay();

    el.addEventListener('click', () => {
      this.toggleCardSelection(index, el);
    });

    return el;
  },

  /**
   * 카드 선택 토글
   */
  toggleCardSelection(index, element) {
    if (element.classList.contains('selected')) {
      element.classList.remove('selected');
      gameState.hand.selectedIndices.delete(index);
    } else {
      // 최대 5장까지만 선택
      if (gameState.hand.selectedIndices.size >= 5) {
        this.showMessage('최대 5장까지만 선택 가능합니다.');
        return;
      }
      element.classList.add('selected');
      gameState.hand.selectedIndices.add(index);
    }

    this.updateHandPreview();
  },

  /**
   * 선택된 카드 표시 업데이트
   */
  updateHandPreview() {
    const selectedCards = gameState.hand.getSelectedCards();

    if (selectedCards.length >= 5) {
      const result = gameState.pokerEvaluator.evaluateBest(selectedCards.slice(0, 5));
      if (result) {
        this.showHandPreview(result);
      }
    } else {
      const preview = document.querySelector('.hand-preview');
      if (preview) {
        preview.textContent = `${selectedCards.length}/5장 선택됨`;
      }
    }
  },

  /**
   * 족보 미리보기 표시
   */
  showHandPreview(result) {
    const preview = document.querySelector('.hand-preview');
    if (preview) {
      const damage = gameState.pokerEvaluator.calculateBaseDamage(result.type);
      preview.textContent = `${result.description} (데미지: ${damage})`;
    }
  },

  /**
   * 플레이 버튼 클릭
   */
  playHand() {
    const selectedCards = gameState.hand.getSelectedCards();

    if (selectedCards.length < 5) {
      this.showMessage('최소 5장을 선택해야 합니다.');
      return;
    }

    // 플레이어 턴 처리
    const result = gameState.combatManager.playerTurn(selectedCards);

    if (result.error) {
      this.showMessage(result.error);
      return;
    }

    // 플레이한 카드 제거
    const indices = Array.from(gameState.hand.selectedIndices).sort((a, b) => b - a);
    indices.forEach((idx) => {
      const card = gameState.hand.cards[idx];
      gameState.deck.discard(card);
    });
    gameState.hand.removeCards(indices);

    // 카드 다시 뽑기
    this.drawNewHand();

    // 손패 다시 렌더링
    this.renderPlayerHand();

    // 데미지 표시
    this.showDamageEffect(result.targetId, result.damage);

    // UI 업데이트
    this.updateBattleUI();

    // 전투 종료 체크
    if (result.combatEnded) {
      setTimeout(() => this.endBattle(result.victory), 1500);
    } else {
      // 몬스터 턴
      setTimeout(() => this.monsterTurn(), 1500);
    }
  },

  /**
   * 카드 버리기
   */
  discardCards() {
    if (gameState.discardCount <= 0) {
      this.showMessage('버리기 횟수가 없습니다.');
      return;
    }

    const selectedCards = gameState.hand.getSelectedCards();
    if (selectedCards.length === 0) {
      this.showMessage('버릴 카드를 선택하세요.');
      return;
    }

    // 선택한 카드 버리기
    const indices = Array.from(gameState.hand.selectedIndices);
    const discarded = gameState.hand.removeCards(indices);
    gameState.deck.discard(discarded);

    // 같은 수만큼 드로우
    const drawn = gameState.deck.draw(discarded.length);
    gameState.hand.addCards(drawn);

    gameState.discardCount--;

    // UI 업데이트
    this.renderPlayerHand();
    this.updateBattleUI();
  },

  /**
   * 몬스터 턴
   */
  monsterTurn() {
    const result = gameState.combatManager.monsterTurn();

    // 플레이어 데미지 표시
    this.showPlayerDamage();

    // UI 업데이트
    this.updateBattleUI();

    // 패배 체크
    if (result && result.combatEnded) {
      setTimeout(() => this.endBattle(false), 1500);
    }
  },

  /**
   * 전투 종료
   */
  async endBattle(victory) {
    if (victory) {
      // 보상 화면으로
      gameState.currentStage.sub++;
      await screenManager.switchTo('reward');
      this.showRewards();
    } else {
      // 게임 오버
      this.showMessage('패배했습니다...');
      setTimeout(() => screenManager.switchTo('menu'), 2000);
    }
  },

  /**
   * 보상 표시
   */
  showRewards() {
    // 코인 보상 (기본)
    const coinAmount = 50 + Math.floor(Math.random() * 50);

    const coinReward = document.querySelector('.coin-reward .reward-value');
    if (coinReward) {
      coinReward.textContent = `+${coinAmount}`;
    }

    // 보상 선택 이벤트
    document.querySelector('.coin-reward').onclick = () => {
      gameState.coins += coinAmount;
      this.selectReward('coin');
    };
  },

  /**
   * 보상 선택
   */
  async selectReward(type) {
    await screenManager.switchTo('stageSelect');
    this.updateStageSelectUI();
  },

  /**
   * 보상 스킵
   */
  async skipReward() {
    await screenManager.switchTo('stageSelect');
    this.updateStageSelectUI();
  },

  /**
   * UI 업데이트 - 전투
   */
  updateBattleUI() {
    // HP 바
    const hpBar = document.querySelector('.player-hp');
    if (hpBar) {
      hpBar.querySelector('span').textContent = `체력 (${gameState.playerHp}/${gameState.maxHp})`;
      hpBar.querySelector('.hp-fill').style.width = `${(gameState.playerHp / gameState.maxHp) * 100}%`;
    }

    // 코인
    const coinCounter = document.querySelector('.coin-counter');
    if (coinCounter) {
      coinCounter.innerHTML = `코인<br>${gameState.coins}`;
    }

    // 스테이지
    const stageLabel = document.querySelector('.stage-label');
    if (stageLabel) {
      stageLabel.textContent = `스테이지 (${gameState.currentStage.main}-${gameState.currentStage.sub})`;
    }

    // 버리기 횟수
    const discardBtn = document.querySelector('.discard-btn');
    if (discardBtn) {
      discardBtn.textContent = `버리기 (${gameState.discardCount})`;
    }

    // 몬스터 상태
    this.updateMonsterDisplay();
  },

  /**
   * 몬스터 표시 업데이트
   */
  updateMonsterDisplay() {
    const monsterContainer = document.querySelector('.monsters-container');
    if (!monsterContainer) return;

    monsterContainer.innerHTML = '';

    gameState.currentMonsters.forEach((monster) => {
      const monsterEl = document.createElement('div');
      monsterEl.className = 'entity-card monster';
      monsterEl.dataset.monsterId = monster.id;
      monsterEl.innerHTML = `
                <div class="entity-name">${monster.name}</div>
                <div class="entity-hp">${monster.currentHp}/${monster.maxHp}</div>
            `;
      monsterContainer.appendChild(monsterEl);
    });
  },

  /**
   * 스테이지 선택 UI 업데이트
   */
  updateStageSelectUI() {
    const stageProgress = document.querySelector('.stage-progress');
    if (stageProgress) {
      stageProgress.textContent = `${gameState.currentStage.main}-${gameState.currentStage.sub} 스테이지`;
    }
  },

  /**
   * 데미지 효과 표시
   */
  showDamageEffect(targetId, damage) {
    console.log('targetId: ', targetId);
    console.log('damage: ', damage);
    const monsterEl = document.querySelector(`[data-monster-id="${targetId}"]`);
    console.log('monsterEl: ', monsterEl);

    if (monsterEl) {
      monsterEl.classList.add('damage');

      const damageText = document.createElement('div');
      damageText.className = 'damage-popup';
      damageText.textContent = `-${damage}`;
      monsterEl.appendChild(damageText);

      // setTimeout(() => {
      //   monsterEl.classList.remove('damage');
      //   damageText.remove();
      // }, 1000);
    }
  },

  /**
   * 플레이어 데미지 표시
   */
  showPlayerDamage() {
    const playerEl = document.querySelector('.player-entity');
    if (playerEl) {
      playerEl.classList.add('damage');
      setTimeout(() => playerEl.classList.remove('damage'), 500);
    }
  },

  /**
   * 메시지 표시
   */
  showMessage(text) {
    console.log(text);
    // 토스트 메시지 구현 예정
  },

  /**
   * 개발중 메시지
   */
  showDevelopingMessage() {
    alert('개발중입니다.');
  },
};

/**
 * 앱 초기화
 */
async function initializeApp() {
  // 매니저 생성
  window.screenManager = new ScreenManager();
  window.cardRenderer = new CardRenderer();

  // 화면 초기화
  await screenManager.initialize();
}

// DOM 로드 완료시 초기화
document.addEventListener('DOMContentLoaded', initializeApp);
