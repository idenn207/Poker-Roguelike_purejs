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
