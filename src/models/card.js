// @ts-check

/**
 * 파일위치: /src/models/card.js
 * 파일명: card.js
 * 용도: 카드 데이터 모델 및 능력 시스템
 * 기능: 기본 카드 52장 + 특수 능력 카드 관리
 * 책임: 카드의 속성과 능력 정의, 조건 검증
 */

// 카드 상수 정의
const SUITS = {
  SPADE: { symbol: '♠', color: 'black', name: 'spade' },
  DIAMOND: { symbol: '♦', color: 'red', name: 'diamond' },
  HEART: { symbol: '♥', color: 'red', name: 'heart' },
  CLUB: { symbol: '♣', color: 'black', name: 'club' },
};

const RANKS = {
  ACE: { value: 1, display: 'A', order: 14 },
  TWO: { value: 2, display: '2', order: 2 },
  THREE: { value: 3, display: '3', order: 3 },
  FOUR: { value: 4, display: '4', order: 4 },
  FIVE: { value: 5, display: '5', order: 5 },
  SIX: { value: 6, display: '6', order: 6 },
  SEVEN: { value: 7, display: '7', order: 7 },
  EIGHT: { value: 8, display: '8', order: 8 },
  NINE: { value: 9, display: '9', order: 9 },
  TEN: { value: 10, display: '10', order: 10 },
  JACK: { value: 11, display: 'J', order: 11 },
  QUEEN: { value: 12, display: 'Q', order: 12 },
  KING: { value: 13, display: 'K', order: 13 },
};

// 능력 타입 정의
const ABILITY_TYPE = {
  // 공격
  DAMAGE_BONUS: 'damage_bonus',
  PIERCE: 'pierce',
  AREA_ATTACK: 'area_attack',
  BURN: 'burn',
  LIFESTEAL: 'lifesteal',
  CRITICAL: 'critical',
  POWER_MULTIPLY: 'power_multiply',
  DELAYED_DAMAGE: 'delayed_damage',
  MULTI_STRIKE: 'multi_strike',

  // 방어
  BLOCK: 'block',
  NULLIFY: 'nullify',
  IMMUNITY: 'immunity',
  ABSORB: 'absorb',
  DAMAGE_REDUCTION: 'damage_reduction',

  // 회복
  HEAL: 'heal',
  OVERHEAL: 'overheal',
  HEAL_LOAN: 'heal_loan',
  CLEANSE: 'cleanse',

  // 유틸
  VULNERABLE: 'vulnerable',
  WEAKEN: 'weaken',
  HEAL_BLOCK: 'heal_block',
  GENERATE_CARD: 'generate_card',
  EXCHANGE: 'exchange',
  DRAW: 'draw',
  DISCARD: 'discard',
  DESTROY_CARD: 'destroy_card',

  // 버프
  POWER_BUFF: 'power_buff',
  BLOCK_BUFF: 'block_buff',
  REGEN_BLOCK: 'regen_block',
  REGEN: 'regen',
  COUNTER: 'counter',
  DRAW_BUFF: 'draw_buff',
};

// 조건 타입 정의
const CONDITION_TYPE = {
  NONE: 'none',
  HAND_TYPE: 'hand_type', // 특정 족보 이상
  SAME_SUIT_COUNT: 'same_suit_count', // 같은 모양 n개 이상
  ON_DISCARD: 'on_discard', // 버렸을 때
  PREVIOUS_CARD: 'previous_card', // 이전 플레이 카드 조건
  DISCARDED_CARD: 'discarded_card', // 버린 카드 조건
  HAS_BUFF: 'has_buff', // 버프 보유
  HEALTH_BELOW: 'health_below', // 체력 n 이하
  HEALTH_COST: 'health_cost', // 체력 소모
  DISCARD_CARDS: 'discard_cards', // 카드 버리기
};

/**
 * 카드 능력 정의 클래스
 */
class CardAbility {
  constructor(type, value, condition = null) {
    this.type = type;
    this.value = value;
    this.condition = condition;
    this.id = this.generateId();
  }

  generateId() {
    return `${this.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 능력 발동 조건 체크
   * @param {Object} context - 게임 컨텍스트
   * @returns {boolean}
   */
  canActivate(context) {
    if (!this.condition) return true;
    return this.condition.check(context);
  }

  /**
   * 능력 설명 텍스트 생성
   * @returns {string}
   */
  getDescription() {
    const conditionText = this.condition ? this.condition.getDescription() : '';
    const abilityText = this.getAbilityText();
    return conditionText ? `${conditionText}: ${abilityText}` : abilityText;
  }

  getAbilityText() {
    // 능력별 텍스트 생성 로직
    const descriptions = {
      [ABILITY_TYPE.DAMAGE_BONUS]: `공격력 +${this.value}`,
      [ABILITY_TYPE.PIERCE]: '방어 무시',
      [ABILITY_TYPE.AREA_ATTACK]: `대상 +${this.value}`,
      [ABILITY_TYPE.BURN]: `화상 +${this.value}`,
      [ABILITY_TYPE.LIFESTEAL]: `흡혈 ${this.value}%`,
      [ABILITY_TYPE.CRITICAL]: '치명타',
      [ABILITY_TYPE.POWER_MULTIPLY]: `위력 x${this.value}`,
      [ABILITY_TYPE.HEAL]: `회복 +${this.value}`,
      [ABILITY_TYPE.BLOCK]: `방어 +${this.value}`,
      [ABILITY_TYPE.DRAW]: `드로우 +${this.value}`,
      // ... 나머지 능력들
    };

    return descriptions[this.type] || `${this.type}: ${this.value}`;
  }
}

/**
 * 능력 발동 조건 클래스
 */
class AbilityCondition {
  constructor(type, params = {}) {
    this.type = type;
    this.params = params;
  }

  /**
   * 조건 충족 여부 확인
   * @param {Object} context - 게임 컨텍스트
   * @returns {boolean}
   */
  check(context) {
    switch (this.type) {
      case CONDITION_TYPE.NONE:
        return true;

      case CONDITION_TYPE.HAND_TYPE:
        return context.handType >= this.params.minHandType;

      case CONDITION_TYPE.SAME_SUIT_COUNT:
        return this.checkSameSuitCount(context);

      case CONDITION_TYPE.ON_DISCARD:
        return context.action === 'discard';

      case CONDITION_TYPE.HEALTH_BELOW:
        return context.playerHealth <= this.params.threshold;

      case CONDITION_TYPE.HAS_BUFF:
        return context.buffs && context.buffs.has(this.params.buffType);

      default:
        return false;
    }
  }

  checkSameSuitCount(context) {
    if (!context.playedCards) return false;

    const suitCounts = {};
    context.playedCards.forEach((card) => {
      suitCounts[card.suit.name] = (suitCounts[card.suit.name] || 0) + 1;
    });

    return Object.values(suitCounts).some((count) => count >= this.params.count);
  }

  getDescription() {
    const descriptions = {
      [CONDITION_TYPE.NONE]: '',
      [CONDITION_TYPE.HAND_TYPE]: `${this.params.minHandType} 이상일 때`,
      [CONDITION_TYPE.SAME_SUIT_COUNT]: `같은 모양 ${this.params.count}개 이상`,
      [CONDITION_TYPE.ON_DISCARD]: '버렸을 때',
      [CONDITION_TYPE.HEALTH_BELOW]: `체력 ${this.params.threshold} 이하`,
      [CONDITION_TYPE.HAS_BUFF]: `${this.params.buffType} 보유시`,
    };

    return descriptions[this.type] || '';
  }
}

/**
 * 카드 클래스
 */
class Card {
  constructor(suit, rank, abilities = []) {
    this.id = this.generateId();
    this.suit = suit;
    this.rank = rank;
    this.abilities = abilities;
    this.isSpecial = abilities.length > 0;
    this.rarity = this.determineRarity();
  }

  generateId() {
    return `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 카드 희귀도 결정
   */
  determineRarity() {
    const abilityCount = this.abilities.length;
    if (abilityCount === 0) return 'common';
    if (abilityCount === 1) return 'uncommon';
    if (abilityCount === 2) return 'rare';
    if (abilityCount === 3) return 'epic';
    return 'legendary';
  }

  /**
   * 카드 표시 텍스트
   */
  getDisplay() {
    return `${this.suit.symbol}${this.rank.display}`;
  }

  /**
   * 카드 전체 정보
   */
  getFullDisplay() {
    const base = this.getDisplay();
    if (!this.isSpecial) return base;

    const abilityText = this.abilities.map((ability) => ability.getDescription()).join(', ');

    return `${base} [${abilityText}]`;
  }

  /**
   * 카드 능력 활성화
   * @param {Object} context - 게임 컨텍스트
   * @returns {Array} 활성화된 능력들
   */
  activateAbilities(context) {
    const activated = [];

    this.abilities.forEach((ability) => {
      if (ability.canActivate(context)) {
        activated.push({
          ability: ability,
          card: this,
        });
      }
    });

    return activated;
  }

  /**
   * 카드 복사
   */
  clone() {
    return new Card(
      this.suit,
      this.rank,
      this.abilities.map((ability) => new CardAbility(ability.type, ability.value, ability.condition))
    );
  }

  /**
   * 카드 비교 (정렬용)
   */
  compareTo(other) {
    if (this.suit.name !== other.suit.name) {
      return this.suit.name.localeCompare(other.suit.name);
    }
    return this.rank.order - other.rank.order;
  }
}

/**
 * 카드 팩토리 클래스
 */
class CardFactory {
  /**
   * 기본 52장 카드 생성
   */
  static createStandardDeck() {
    const cards = [];

    Object.values(SUITS).forEach((suit) => {
      Object.values(RANKS).forEach((rank) => {
        cards.push(new Card(suit, rank));
      });
    });

    return cards;
  }

  /**
   * 특수 카드 생성
   */
  static createSpecialCard(suit, rank, abilityConfigs) {
    const abilities = abilityConfigs.map((config) => {
      const condition = config.condition ? new AbilityCondition(config.condition.type, config.condition.params) : null;

      return new CardAbility(config.type, config.value, condition);
    });

    return new Card(suit, rank, abilities);
  }

  /**
   * 랜덤 특수 카드 생성
   */
  static createRandomSpecialCard(rarity = 'rare') {
    const suit = this.getRandomSuit();
    const rank = this.getRandomRank();
    const abilityCount = this.getAbilityCountByRarity(rarity);
    const abilities = this.generateRandomAbilities(abilityCount);

    return new Card(suit, rank, abilities);
  }

  static getRandomSuit() {
    const suits = Object.values(SUITS);
    return suits[Math.floor(Math.random() * suits.length)];
  }

  static getRandomRank() {
    const ranks = Object.values(RANKS);
    return ranks[Math.floor(Math.random() * ranks.length)];
  }

  static getAbilityCountByRarity(rarity) {
    const counts = {
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
    };
    return counts[rarity] || 1;
  }

  static generateRandomAbilities(count) {
    // 랜덤 능력 생성 로직
    const abilities = [];
    const types = Object.values(ABILITY_TYPE);

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const value = Math.floor(Math.random() * 5) + 1;
      abilities.push(new CardAbility(type, value));
    }

    return abilities;
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Card,
    CardAbility,
    AbilityCondition,
    CardFactory,
    SUITS,
    RANKS,
    ABILITY_TYPE,
    CONDITION_TYPE,
  };
}
