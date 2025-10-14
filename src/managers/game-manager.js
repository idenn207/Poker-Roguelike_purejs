// @ts-check

/**
 * 파일위치: /src/managers/game-manager.js
 * 파일명: game-manager.js
 * 용도: 게임 진행 관리
 * 기능: Deck과 Hand 통합 관리
 * 책임: 게임 로직 및 카드 이동 조정
 */

class GameManager {
  constructor() {
    this.deck = new Deck();
    this.hand = new Hand(10);
  }

  /**
   * 게임 초기화
   */
  initialize() {
    this.deck.initialize().shuffle();
    this.drawCards(10);
    return this;
  }

  /**
   * 카드 드로우
   * @param {number} count
   * @returns {Card[]}
   */
  drawCards(count = 1) {
    const drawn = this.deck.draw(count);
    this.hand.addCards(drawn);
    return drawn;
  }

  /**
   * 손패에서 카드 버리기
   * @param {number[]} indices
   * @returns {Card[]}
   */
  discardFromHand(indices) {
    const discarded = this.hand.removeCards(indices);
    this.deck.discard(discarded);
    return discarded;
  }

  /**
   * 카드 교환
   * @param {number[]} indices
   * @returns {Object}
   */
  exchangeCards(indices) {
    const discarded = this.discardFromHand(indices);
    const drawn = this.drawCards(discarded.length);

    return { discarded, drawn };
  }

  /**
   * 선택된 카드 플레이
   * @returns {Card[]}
   */
  playSelectedCards() {
    const played = this.hand.playSelectedCards();
    // 플레이된 카드는 버림덱으로
    this.deck.discard(played);
    return played;
  }

  /**
   * 모든 손패 버리기
   */
  discardAllHand() {
    const discarded = this.hand.discardAll();
    this.deck.discard(discarded);
    return discarded;
  }

  /**
   * 게임 상태
   */
  getStatus() {
    return {
      deck: this.deck.getStatus(),
      hand: this.hand.getInfo(),
    };
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GameManager,
  };
}
