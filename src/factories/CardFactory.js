/**
 * 카드 팩토리 클래스
 */
class CardFactory {
  /**
   * 카드 생성
   */
  static createCard(suit, rank, _abilities = [], _condition = CONDITION_TYPE.NONE) {
    /**
     * 카드 능력 생성
     * @todo 구현예정
     */
    const abilities = _abilities.map((ability) => new CardAbility(ability.type, ability.value, ability.condition));

    /**
     * 카드 상태 조건 생성
     * @todo 구현예정
     */
    const condition = new AbilityCondition(_condition.type, _condition.params);

    return new Card(suit, rank, abilities, condition);
  }

  /**
   * 카드 ID로 카드 생성
   */
  static createCardById(cardId) {
    const cardDef = this.findCardDefinitionById(cardId);
    if (!cardDef) return null;

    return this.createCard(cardDef.suit, cardDef.rank, cardDef.abilities, cardDef.condition);
  }

  /**
   * 랜덤 특수 카드 생성
   */
  static createRandomSpecialCard(rarity = 'rare') {
    const suit = this.#getRandomSuit();
    const rank = this.#getRandomRank();
    const abilityCount = this.#getAbilityCountByRarity(rarity);
    const abilities = this.#generateRandomAbilities(abilityCount);
    const condition = null; // condition ? new AbilityCondition(condition.type, condition.params) : null;

    return this.createCard(suit, rank, abilities, condition);
  }

  #getRandomSuit() {
    const suits = Object.values(SUITS);
    return suits[Math.floor(Math.random() * suits.length)];
  }

  #getRandomRank() {
    const ranks = Object.values(RANKS);
    return ranks[Math.floor(Math.random() * ranks.length)];
  }

  #getAbilityCountByRarity(rarity) {
    const counts = {
      uncommon: 1,
      rare: 2,
      epic: 3,
      legendary: 4,
    };
    return counts[rarity] || 1;
  }

  #generateRandomAbilities(count) {
    // 랜덤 능력 생성 로직
    const abilities = [];
    const types = Object.values(ABILITY_TYPE);

    for (let i = 0; i < count; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const value = Math.floor(Math.random() * 5) + 1;

      /** @todo 구현예정 */
      // abilities.push(new CardAbility(type, value));
    }

    return abilities;
  }

  /** 카드 ID로 카드 정의 찾기 */
  #findCardDefinitionById(cardId) {
    return Object.entries(CARDS).find(([key, { id }]) => id === cardId) || null;
  }
}
