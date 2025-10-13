// 기본 카드 덱 생성
const standardDeck = CardFactory.createStandardDeck();
console.log(`Standard deck: ${standardDeck.length} cards`);

// 특수 카드 생성 예제
const specialCard = CardFactory.createSpecialCard(SUITS.HEART, RANKS.ACE, [
  {
    type: ABILITY_TYPE.DAMAGE_BONUS,
    value: 5,
    condition: {
      type: CONDITION_TYPE.HAND_TYPE,
      params: { minHandType: 'straight' },
    },
  },
  {
    type: ABILITY_TYPE.HEAL,
    value: 3,
  },
]);

console.log(specialCard.getFullDisplay());
// 출력: ♥A [straight 이상일 때: 공격력 +5, 회복 +3]

// 능력 활성화 테스트
const context = {
  handType: 'full_house',
  playerHealth: 50,
  playedCards: [],
};

const activated = specialCard.activateAbilities(context);
console.log(`Activated abilities: ${activated.length}`);
