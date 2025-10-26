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
