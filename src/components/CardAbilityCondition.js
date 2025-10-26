/**
 * 카드 능력 발동 조건 클래스
 */
class CardAbilityCondition {
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
