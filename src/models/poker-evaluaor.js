'use strict';
// @ts-check

/**
 * 파일위치: /src/models/poker-evaluator.js
 * 파일명: poker-evaluator.js
 * 용도: 세븐 포커 족보 판정
 * 기능: 7장 중 최적 5장 선택, 족보 판정
 * 책임: 포커 핸드 평가 및 순위 결정
 */

// 족보 타입 정의
const HAND_TYPES = {
  HIGH_CARD: { rank: 0, name: '하이카드', multiplier: 1 },
  ONE_PAIR: { rank: 1, name: '원페어', multiplier: 2 },
  TWO_PAIR: { rank: 2, name: '투페어', multiplier: 3 },
  THREE_OF_KIND: { rank: 3, name: '쓰리카드', multiplier: 4 },
  STRAIGHT: { rank: 4, name: '스트레이트', multiplier: 5 },
  FLUSH: { rank: 5, name: '플러쉬', multiplier: 6 },
  FULL_HOUSE: { rank: 6, name: '풀하우스', multiplier: 8 },
  FOUR_OF_KIND: { rank: 7, name: '포카드', multiplier: 10 },
  STRAIGHT_FLUSH: { rank: 8, name: '스트레이트 플러쉬', multiplier: 15 },
  ROYAL_FLUSH: { rank: 9, name: '로얄 플러쉬', multiplier: 20 },
};

/**
 * 포커 족보 판정 클래스
 */
class PokerEvaluator {
  constructor() {
    this.combinations = [];
    this.generateCombinations();
  }

  /**
   * 7장 중 5장 조합 생성 (C(7,5) = 21)
   */
  generateCombinations() {
    const indices = [0, 1, 2, 3, 4, 5, 6];
    for (let i = 0; i < indices.length - 4; i++) {
      for (let j = i + 1; j < indices.length - 3; j++) {
        for (let k = j + 1; k < indices.length - 2; k++) {
          for (let l = k + 1; l < indices.length - 1; l++) {
            for (let m = l + 1; m < indices.length; m++) {
              this.combinations.push([i, j, k, l, m]);
            }
          }
        }
      }
    }
  }

  /**
   * 7장의 카드에서 최적의 5장 선택하여 평가
   * @param {Card[]} cards - 7장의 카드
   * @returns {Object} 평가 결과
   */
  evaluateBest(cards) {
    if (cards.length < 5) {
      return null;
    }

    let bestResult = null;
    let bestScore = -1;

    // 7장 중 5장 모든 조합 검사
    const sevenCards = cards.slice(0, 7);

    this.combinations.forEach((combo) => {
      if (combo.every((idx) => idx < sevenCards.length)) {
        const fiveCards = combo.map((idx) => sevenCards[idx]);
        const result = this.evaluateHand(fiveCards);

        if (result.score > bestScore) {
          bestScore = result.score;
          bestResult = result;
        }
      }
    });

    return bestResult;
  }

  /**
   * 5장의 카드 족보 판정
   * @param {Card[]} cards - 5장의 카드
   * @returns {Object} 평가 결과
   */
  evaluateHand(cards) {
    if (cards.length !== 5) {
      throw new Error('Exactly 5 cards required');
    }

    // 카드 정렬 (랭크 순)
    const sorted = [...cards].sort((a, b) => b.rank.order - a.rank.order);

    // 기본 정보 수집
    const ranks = this.getRankCounts(sorted);
    const suits = this.getSuitCounts(sorted);
    const isFlush = this.checkFlush(suits);
    const straightInfo = this.checkStraight(sorted);

    // 족보 판정
    let handType = null;
    let kickers = [];

    // 로얄 플러쉬 체크
    if (isFlush && straightInfo.isStraight && straightInfo.highCard === 14) {
      handType = HAND_TYPES.ROYAL_FLUSH;
      kickers = [14];
    }
    // 스트레이트 플러쉬 체크
    else if (isFlush && straightInfo.isStraight) {
      handType = HAND_TYPES.STRAIGHT_FLUSH;
      kickers = [straightInfo.highCard];
    }
    // 포카드 체크
    else if (ranks.counts[4]) {
      handType = HAND_TYPES.FOUR_OF_KIND;
      kickers = [ranks.counts[4][0], ranks.counts[1] ? ranks.counts[1][0] : 0];
    }
    // 풀하우스 체크
    else if (ranks.counts[3] && ranks.counts[2]) {
      handType = HAND_TYPES.FULL_HOUSE;
      kickers = [ranks.counts[3][0], ranks.counts[2][0]];
    }
    // 플러쉬 체크
    else if (isFlush) {
      handType = HAND_TYPES.FLUSH;
      kickers = sorted.map((c) => c.rank.order);
    }
    // 스트레이트 체크
    else if (straightInfo.isStraight) {
      handType = HAND_TYPES.STRAIGHT;
      kickers = [straightInfo.highCard];
    }
    // 쓰리카드 체크
    else if (ranks.counts[3]) {
      handType = HAND_TYPES.THREE_OF_KIND;
      kickers = [ranks.counts[3][0], ...ranks.counts[1].slice(0, 2)];
    }
    // 투페어 체크
    else if (ranks.counts[2] && ranks.counts[2].length >= 2) {
      handType = HAND_TYPES.TWO_PAIR;
      kickers = [ranks.counts[2][0], ranks.counts[2][1], ranks.counts[1] ? ranks.counts[1][0] : 0];
    }
    // 원페어 체크
    else if (ranks.counts[2]) {
      handType = HAND_TYPES.ONE_PAIR;
      kickers = [ranks.counts[2][0], ...ranks.counts[1].slice(0, 3)];
    }
    // 하이카드
    else {
      handType = HAND_TYPES.HIGH_CARD;
      kickers = sorted.map((c) => c.rank.order);
    }

    // 점수 계산
    const score = this.calculateScore(handType, kickers);

    return {
      type: handType,
      cards: cards,
      kickers: kickers,
      score: score,
      description: this.getHandDescription(handType, kickers),
    };
  }

  /**
   * 랭크별 카드 수 계산
   * @param {Card[]} cards
   * @returns {Object}
   */
  getRankCounts(cards) {
    const rankMap = {};

    cards.forEach((card) => {
      const order = card.rank.order;
      if (!rankMap[order]) {
        rankMap[order] = 0;
      }
      rankMap[order]++;
    });

    // 개수별로 그룹화
    const counts = { 1: [], 2: [], 3: [], 4: [] };

    Object.entries(rankMap).forEach(([rank, count]) => {
      if (counts[count]) {
        counts[count].push(parseInt(rank));
      }
    });

    // 각 그룹 내림차순 정렬
    Object.values(counts).forEach((group) => {
      group.sort((a, b) => b - a);
    });

    return { map: rankMap, counts };
  }

  /**
   * 무늬별 카드 수 계산
   * @param {Card[]} cards
   * @returns {Object}
   */
  getSuitCounts(cards) {
    const suitMap = {};

    cards.forEach((card) => {
      const suit = card.suit.name;
      if (!suitMap[suit]) {
        suitMap[suit] = 0;
      }
      suitMap[suit]++;
    });

    return suitMap;
  }

  /**
   * 플러쉬 체크
   * @param {Object} suits
   * @returns {boolean}
   */
  checkFlush(suits) {
    return Object.values(suits).some((count) => count >= 5);
  }

  /**
   * 스트레이트 체크
   * @param {Card[]} cards - 정렬된 카드
   * @returns {Object}
   */
  checkStraight(cards) {
    const ranks = cards.map((c) => c.rank.order);

    // 일반 스트레이트 체크
    let isConsecutive = true;
    for (let i = 0; i < ranks.length - 1; i++) {
      if (ranks[i] - ranks[i + 1] !== 1) {
        isConsecutive = false;
        break;
      }
    }

    if (isConsecutive) {
      return { isStraight: true, highCard: ranks[0] };
    }

    // A-2-3-4-5 스트레이트 체크 (백스트레이트)
    if (ranks[0] === 14 && ranks[1] === 5 && ranks[2] === 4 && ranks[3] === 3 && ranks[4] === 2) {
      return { isStraight: true, highCard: 5 };
    }

    return { isStraight: false, highCard: 0 };
  }

  /**
   * 점수 계산
   * @param {Object} handType
   * @param {number[]} kickers
   * @returns {number}
   */
  calculateScore(handType, kickers) {
    let score = handType.rank * 10000000;

    kickers.forEach((kicker, index) => {
      score += kicker * Math.pow(100, 4 - index);
    });

    return score;
  }

  /**
   * 족보 설명 생성
   * @param {Object} handType
   * @param {number[]} kickers
   * @returns {string}
   */
  getHandDescription(handType, kickers) {
    console.log('kickers: ', kickers);
    const rankName = (order) => {
      const names = {
        14: 'A',
        13: 'K',
        12: 'Q',
        11: 'J',
        10: '10',
        9: '9',
        8: '8',
        7: '7',
        6: '6',
        5: '5',
        4: '4',
        3: '3',
        2: '2',
      };
      return names[order] || order.toString();
    };

    let description = handType.name;

    switch (handType) {
      case HAND_TYPES.ROYAL_FLUSH:
        description = '로얄 플러쉬';
        break;
      case HAND_TYPES.STRAIGHT_FLUSH:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
      case HAND_TYPES.FOUR_OF_KIND:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
      case HAND_TYPES.FULL_HOUSE:
        description = `${rankName(kickers[0])}, ${rankName(kickers[1])} ${handType.name}`;
        break;
      case HAND_TYPES.STRAIGHT:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
      case HAND_TYPES.THREE_OF_KIND:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
      case HAND_TYPES.TWO_PAIR:
        description = `${rankName(kickers[0])}, ${rankName(kickers[1])} ${handType.name}`;
        break;
      case HAND_TYPES.ONE_PAIR:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
      case HAND_TYPES.HIGH_CARD:
        description = `${rankName(kickers[0])} ${handType.name}`;
        break;
    }

    return description;
  }

  /**
   * 두 핸드 비교
   * @param {Object} hand1
   * @param {Object} hand2
   * @returns {number} 1: hand1 승, -1: hand2 승, 0: 무승부
   */
  compareHands(hand1, hand2) {
    if (hand1.score > hand2.score) return 1;
    if (hand1.score < hand2.score) return -1;
    return 0;
  }

  /**
   * 족보별 기본 데미지 계산
   * @param {Object} handType
   * @returns {number}
   */
  calculateBaseDamage(handType) {
    const baseDamage = {
      [HAND_TYPES.HIGH_CARD.name]: 5,
      [HAND_TYPES.ONE_PAIR.name]: 10,
      [HAND_TYPES.TWO_PAIR.name]: 15,
      [HAND_TYPES.THREE_OF_KIND.name]: 20,
      [HAND_TYPES.STRAIGHT.name]: 25,
      [HAND_TYPES.FLUSH.name]: 30,
      [HAND_TYPES.FULL_HOUSE.name]: 40,
      [HAND_TYPES.FOUR_OF_KIND.name]: 50,
      [HAND_TYPES.STRAIGHT_FLUSH.name]: 75,
      [HAND_TYPES.ROYAL_FLUSH.name]: 100,
    };

    return baseDamage[handType.name] || 5;
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PokerEvaluator,
    HAND_TYPES,
  };
}
