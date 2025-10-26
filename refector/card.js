// @ts-check

/**
 * 파일위치: /src/models/card.js
 * 파일명: card.js
 * 용도: 카드 데이터 모델 및 능력 시스템
 * 기능: 기본 카드 52장 + 특수 능력 카드 관리
 * 책임: 카드의 속성과 능력 정의, 조건 검증
 */

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
