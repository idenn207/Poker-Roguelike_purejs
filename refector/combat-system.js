'use strict';
// @ts-check

/**
 * 파일위치: /src/models/combat-system.js
 * 파일명: combat-system.js
 * 용도: 전투 시스템
 * 기능: 데미지 계산, 전투 진행
 * 책임: 전투 로직 처리
 */

/**
 * 몬스터 클래스
 */
class Monster {
  constructor(config) {
    this.id = this.generateId();
    this.name = config.name || '몬스터';
    this.type = config.type || 'normal'; // normal, elite, boss
    this.maxHp = config.maxHp || 40;
    this.currentHp = this.maxHp;
    this.attackPattern = config.attackPattern || [];
    this.currentPatternIndex = 0;
    this.buffs = new Map();
    this.debuffs = new Map();
  }

  generateId() {
    return `monster_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 데미지 받기
   * @param {number} damage
   * @returns {Object} 결과
   */
  takeDamage(damage) {
    const actualDamage = Math.max(0, damage - this.getDefense());
    this.currentHp = Math.max(0, this.currentHp - actualDamage);

    return {
      damage: actualDamage,
      isDead: this.isDead(),
      remainingHp: this.currentHp,
    };
  }

  /**
   * 방어력 계산
   * @returns {number}
   */
  getDefense() {
    let defense = 0;
    if (this.buffs.has('defense')) {
      defense += this.buffs.get('defense').value;
    }
    return defense;
  }

  /**
   * 공격 패턴 가져오기
   * @returns {Object}
   */
  getNextAttack() {
    if (this.attackPattern.length === 0) {
      return { type: 'damage', value: 10 };
    }

    const attack = this.attackPattern[this.currentPatternIndex];
    this.currentPatternIndex = (this.currentPatternIndex + 1) % this.attackPattern.length;

    return attack;
  }

  /**
   * 몬스터 족보 생성 (AI)
   * @returns {Card[]}
   */
  generateHand() {
    // 난이도에 따른 족보 생성
    const deck = new Deck().initialize().shuffle();
    const cards = deck.draw(7);

    // 몬스터 타입에 따라 더 좋은 족보 확률
    if (this.type === 'boss') {
      // 보스는 더 좋은 족보 확률 높음
      return this.optimizeHand(cards);
    }

    return cards;
  }

  /**
   * 핸드 최적화 (AI)
   * @param {Card[]} cards
   * @returns {Card[]}
   */
  optimizeHand(cards) {
    // 간단한 최적화: 같은 랭크나 무늬 우선
    return cards.sort((a, b) => {
      if (a.rank.order === b.rank.order) return 0;
      return b.rank.order - a.rank.order;
    });
  }

  /**
   * 생존 여부
   * @returns {boolean}
   */
  isDead() {
    return this.currentHp <= 0;
  }

  /**
   * 상태 정보
   * @returns {Object}
   */
  getStatus() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      hp: this.currentHp,
      maxHp: this.maxHp,
      hpPercent: (this.currentHp / this.maxHp) * 100,
      buffs: Array.from(this.buffs.entries()),
      debuffs: Array.from(this.debuffs.entries()),
      nextAttack: this.getNextAttack(),
    };
  }
}

/**
 * 전투 관리자
 */
class CombatManager {
  constructor() {
    this.player = null;
    this.monsters = [];
    this.turn = 0;
    this.isPlayerTurn = true;
    this.combatLog = [];
    this.pokerEvaluator = new PokerEvaluator();
  }

  /**
   * 전투 시작
   * @param {Object} player
   * @param {Monster[]} monsters
   */
  startCombat(player, monsters) {
    this.player = player;
    this.monsters = monsters;
    this.turn = 0;
    this.isPlayerTurn = true;
    this.combatLog = [];

    this.logAction('전투 시작!');

    return this.getCombatState();
  }

  /**
   * 플레이어 턴 처리
   * @param {Card[]} selectedCards
   * @returns {Object}
   */
  playerTurn(selectedCards) {
    if (!this.isPlayerTurn) {
      return { error: '플레이어 턴이 아닙니다.' };
    }

    // 족보 판정
    const handResult = this.pokerEvaluator.evaluateBest(selectedCards);

    if (!handResult) {
      return { error: '유효한 족보가 아닙니다.' };
    }

    // 데미지 계산
    const baseDamage = this.pokerEvaluator.calculateBaseDamage(handResult.type);
    const totalDamage = this.calculatePlayerDamage(baseDamage, handResult);

    // 타겟 선택 (현재는 첫 번째 살아있는 몬스터)
    const target = this.monsters.find((m) => !m.isDead());

    if (!target) {
      return { error: '공격할 대상이 없습니다.' };
    }

    // 데미지 적용
    const result = target.takeDamage(totalDamage);

    this.logAction(`${handResult.description}! ${result.damage} 데미지!`);

    // 몬스터 처치 확인
    if (result.isDead) {
      this.logAction(`${target.name} 처치!`);

      // 모든 몬스터 처치 확인
      if (this.monsters.every((m) => m.isDead())) {
        return this.endCombat(true);
      }
    }

    // 턴 종료
    this.isPlayerTurn = false;

    // 몬스터 턴 자동 실행
    setTimeout(() => this.monsterTurn(), 1000);

    return {
      success: true,
      hand: handResult,
      damage: result.damage,
      targetId: target.id,
      combatState: this.getCombatState(),
    };
  }

  /**
   * 몬스터 턴 처리
   */
  monsterTurn() {
    if (this.isPlayerTurn) return;

    const aliveMonsters = this.monsters.filter((m) => !m.isDead());

    aliveMonsters.forEach((monster) => {
      const attack = monster.getNextAttack();

      switch (attack.type) {
        case 'damage':
          this.player.takeDamage(attack.value);
          this.logAction(`${monster.name}의 공격! ${attack.value} 데미지!`);
          break;
        case 'block':
          monster.buffs.set('defense', { value: attack.value, turns: 1 });
          this.logAction(`${monster.name}가 방어 자세!`);
          break;
      }
    });

    // 플레이어 사망 확인
    if (this.player.isDead()) {
      return this.endCombat(false);
    }

    // 턴 증가
    this.turn++;
    this.isPlayerTurn = true;

    return this.getCombatState();
  }

  /**
   * 플레이어 데미지 계산
   * @param {number} baseDamage
   * @param {Object} handResult
   * @returns {number}
   */
  calculatePlayerDamage(baseDamage, handResult) {
    let damage = baseDamage;

    // 배수 적용
    damage *= handResult.type.multiplier;

    // 버프 적용
    if (this.player.buffs && this.player.buffs.has('power')) {
      damage += this.player.buffs.get('power').value;
    }

    return Math.floor(damage);
  }

  /**
   * 전투 종료
   * @param {boolean} victory
   */
  endCombat(victory) {
    this.logAction(victory ? '승리!' : '패배...');

    return {
      combatEnded: true,
      victory: victory,
      rewards: victory ? this.generateRewards() : null,
      combatLog: this.combatLog,
    };
  }

  /**
   * 보상 생성
   */
  generateRewards() {
    const rewards = [];

    // 코인 보상
    const coinAmount = 50 + this.turn * 10;
    rewards.push({ type: 'coin', value: coinAmount });

    // 카드 보상 (확률)
    if (Math.random() < 0.3) {
      rewards.push({
        type: 'card',
        value: CardFactory.createRandomSpecialCard('rare'),
      });
    }

    return rewards;
  }

  /**
   * 전투 상태 가져오기
   */
  getCombatState() {
    return {
      turn: this.turn,
      isPlayerTurn: this.isPlayerTurn,
      player: {
        hp: this.player.currentHp,
        maxHp: this.player.maxHp,
        buffs: this.player.buffs ? Array.from(this.player.buffs.entries()) : [],
      },
      monsters: this.monsters.map((m) => m.getStatus()),
      combatLog: this.combatLog.slice(-5), // 최근 5개 로그
    };
  }

  /**
   * 액션 로그
   * @param {string} message
   */
  logAction(message) {
    this.combatLog.push({
      turn: this.turn,
      message: message,
      timestamp: Date.now(),
    });
  }
}

// 몬스터 프리셋
const MONSTER_PRESETS = {
  // 일반 몬스터
  goblin: {
    name: '고블린',
    type: 'normal',
    maxHp: 30,
    attackPattern: [
      { type: 'damage', value: 5 },
      { type: 'damage', value: 5 },
      { type: 'damage', value: 8 },
    ],
  },

  slime: {
    name: '슬라임',
    type: 'normal',
    maxHp: 40,
    attackPattern: [
      { type: 'damage', value: 3 },
      { type: 'block', value: 5 },
      { type: 'damage', value: 3 },
    ],
  },

  // 엘리트 몬스터
  ogre: {
    name: '오우거',
    type: 'elite',
    maxHp: 80,
    attackPattern: [
      { type: 'damage', value: 12 },
      { type: 'damage', value: 15 },
      { type: 'block', value: 10 },
    ],
  },

  // 보스 몬스터
  dragon: {
    name: '드래곤',
    type: 'boss',
    maxHp: 150,
    attackPattern: [
      { type: 'damage', value: 20 },
      { type: 'damage', value: 25 },
      { type: 'block', value: 15 },
      { type: 'damage', value: 30 },
    ],
  },
};

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Monster,
    CombatManager,
    MONSTER_PRESETS,
  };
}
