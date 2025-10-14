// @ts-check

/**
 * 파일위치: /src/models/deck.js
 * 파일명: deck.js
 * 용도: 덱 관리 시스템
 * 기능: 카드 생성, 셔플, 드로우, 버리기
 * 책임: 카드 풀 관리 (drawPile, discardPile)
 */

/**
 * 덱 클래스
 */
class Deck {
  constructor() {
    this.drawPile = []; // 뽑을 카드 더미
    this.discardPile = []; // 버린 카드 더미
  }

  /**
   * 덱 초기화 - 52장 기본 카드 생성
   */
  initialize() {
    this.drawPile = CardFactory.createStandardDeck();
    this.discardPile = [];
    return this;
  }

  /**
   * 특수 카드 추가
   * @param {Card} card - 추가할 카드
   * @param {string} target - 'draw' | 'discard' | 'hand'
   */
  addCard(card, target = 'draw') {
    const targetPile = this.getTargetPile(target);
    if (targetPile) {
      targetPile.push(card);
    }
    return this;
  }

  /**
   * 여러 카드 추가
   * @param {Card[]} cards - 추가할 카드들
   * @param {string} target - 'draw' | 'discard' | 'hand'
   */
  addCards(cards, target = 'draw') {
    cards.forEach((card) => this.addCard(card, target));
    return this;
  }

  // shuffle 메서드 수정
  /**
   * 덱 셔플
   * @param {string} target - 'draw' | 'discard' | 'all'
   */
  shuffle(target = 'draw') {
    if (target === 'all') {
      shuffleArray(this.drawPile);
      shuffleArray(this.discardPile);
    } else {
      const targetPile = this.getTargetPile(target);
      if (targetPile) {
        shuffleArray(targetPile);
      }
    }
    return this;
  }

  /**
   * 카드 드로우
   * @param {number} count - 드로우할 카드 수
   * @returns {Card[]} 드로우한 카드들
   */
  draw(count = 1) {
    const drawnCards = [];

    for (let i = 0; i < count; i++) {
      // 드로우 덱이 비었을 때 버린 카드 덱을 섞어서 보충
      if (this.drawPile.length === 0 && this.discardPile.length > 0) {
        this.reshuffleDiscardPile();
      }

      // 카드가 있으면 드로우
      if (this.drawPile.length > 0) {
        const card = this.drawPile.pop();
        drawnCards.push(card);
      }
    }

    return drawnCards;
  }

  /**
   * 카드 버리기
   * @param {Card|Card[]} cards - 버릴 카드
   * @returns {Card[]} 버린 카드들
   */
  discard(cards) {
    const discardedCards = [];
    const targets = Array.isArray(cards) ? cards : [cards];

    targets.forEach((card) => {
      this.discardPile.push(card);
      discardedCards.push(card);
    });

    return discardedCards;
  }

  /**
   * 버린 카드 덱을 드로우 덱으로 재편성
   */
  reshuffleDiscardPile() {
    this.drawPile = [...this.discardPile];
    this.discardPile = [];
    this.shuffle('draw');
    return this;
  }

  /**
   * 특정 조건의 카드 검색
   * @param {Function} predicate - 검색 조건 함수
   * @param {string} target - 'draw' | 'discard' | 'all'
   * @returns {Card[]}
   */
  findCards(predicate, target = 'draw') {
    if (target === 'all') {
      return [...this.drawPile.filter(predicate), ...this.discardPile.filter(predicate)];
    }

    const targetPile = this.getTargetPile(target);
    return targetPile ? targetPile.filter(predicate) : [];
  }

  /**
   * 대상 더미 가져오기
   * @param {string} target - 'draw' | 'discard'
   * @returns {Card[]|null}
   */
  getTargetPile(target) {
    switch (target) {
      case 'draw':
        return this.drawPile;
      case 'discard':
        return this.discardPile;
      default:
        return null;
    }
  }

  /**
   * 덱 상태 정보
   * @returns {Object}
   */
  getStatus() {
    return {
      drawCount: this.drawPile.length,
      discardCount: this.discardPile.length,
      totalCards: this.drawPile.length + this.discardPile.length,
    };
  }

  /**
   * 덱 리셋
   */
  reset() {
    this.drawPile = [];
    this.discardPile = [];
    return this;
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Deck,
  };
}
