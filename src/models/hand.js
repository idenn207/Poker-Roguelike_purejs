// @ts-check

/**
 * 파일위치: /src/models/hand.js
 * 파일명: hand.js
 * 용도: 손패 관리 시스템
 * 기능: 10장 카드 관리, 선택, 플레이, 정렬
 * 책임: 손패 카드 조작 및 상태 관리
 */

/**
 * 손패 관리 클래스
 */
class Hand {
  constructor(maxSize = 10) {
    this.cards = [];
    this.maxSize = maxSize;
    this.selectedIndices = new Set();
  }

  /**
   * 카드 추가
   * @param {Card|Card[]} cards - 추가할 카드
   * @returns {boolean} 추가 성공 여부
   */
  addCards(cards) {
    const cardsToAdd = Array.isArray(cards) ? cards : [cards];
    const availableSpace = this.maxSize - this.cards.length;

    if (availableSpace <= 0) return false;

    const actualAdd = cardsToAdd.slice(0, availableSpace);
    this.cards.push(...actualAdd);

    return actualAdd.length > 0;
  }

  /**
   * 특정 위치에 카드 삽입
   * @param {Card} card - 삽입할 카드
   * @param {number} index - 삽입 위치
   * @returns {boolean}
   */
  insertCard(card, index) {
    if (this.isFull()) return false;

    const position = Math.max(0, Math.min(index, this.cards.length));
    this.cards.splice(position, 0, card);

    // 선택 인덱스 조정
    this.adjustSelectedIndices(position, 1);

    return true;
  }

  /**
   * 카드 제거
   * @param {number|number[]} indices - 제거할 카드 인덱스
   * @returns {Card[]} 제거된 카드들
   */
  removeCards(indices) {
    const toRemove = Array.isArray(indices) ? indices : [indices];
    const sorted = [...toRemove].sort((a, b) => b - a);
    const removed = [];

    sorted.forEach((index) => {
      if (this.isValidIndex(index)) {
        const card = this.cards.splice(index, 1)[0];
        removed.push(card);

        // 선택 상태 제거
        this.selectedIndices.delete(index);
      }
    });

    // 선택 인덱스 재조정
    this.recalculateSelectedIndices();

    return removed.reverse();
  }

  /**
   * 카드 선택/해제
   * @param {number|number[]} indices - 선택할 인덱스
   * @param {boolean} toggle - 토글 모드
   */
  selectCards(indices, toggle = true) {
    const targets = Array.isArray(indices) ? indices : [indices];

    targets.forEach((index) => {
      if (!this.isValidIndex(index)) return;

      if (toggle) {
        if (this.selectedIndices.has(index)) {
          this.selectedIndices.delete(index);
        } else {
          this.selectedIndices.add(index);
        }
      } else {
        this.selectedIndices.add(index);
      }
    });
  }

  /**
   * 모든 선택 해제
   */
  clearSelection() {
    this.selectedIndices.clear();
  }

  /**
   * 모든 카드 버리기 (Deck과 연동)
   * @returns {Card[]} 버린 카드들
   */
  discardAll() {
    const discardedCards = [...this.cards];
    this.cards = [];
    this.clearSelection();
    return discardedCards;
  }

  /**
   * 특정 카드 버리기
   * @param {number[]} indices - 버릴 카드 인덱스
   * @returns {Card[]} 버린 카드들
   */
  discardCards(indices) {
    const removed = this.removeCards(indices);
    return removed;
  }

  /**
   * 선택된 카드들 가져오기
   * @returns {Card[]}
   */
  getSelectedCards() {
    return Array.from(this.selectedIndices)
      .sort((a, b) => a - b)
      .map((index) => this.cards[index])
      .filter((card) => card !== undefined);
  }

  /**
   * 선택된 카드 플레이 (제거)
   * @returns {Card[]} 플레이된 카드들
   */
  playSelectedCards() {
    const selected = Array.from(this.selectedIndices).sort((a, b) => b - a);
    const played = [];

    selected.forEach((index) => {
      const card = this.cards.splice(index, 1)[0];
      if (card) played.push(card);
    });

    this.clearSelection();
    return played.reverse();
  }

  /**
   * 특정 조건의 카드 찾기
   * @param {Function} predicate - 검색 조건
   * @returns {Object[]} { card, index }[]
   */
  findCards(predicate) {
    const results = [];

    this.cards.forEach((card, index) => {
      if (predicate(card)) {
        results.push({ card, index });
      }
    });

    return results;
  }

  /**
   * 손패 정렬
   * @param {string|Function} method - 정렬 방법
   */
  sort(method = 'suit-rank') {
    // 선택 상태 저장
    const selectedCards = this.getSelectedCards();

    switch (method) {
      case 'suit-rank':
        this.cards.sort((a, b) => {
          if (a.suit.name !== b.suit.name) {
            return a.suit.name.localeCompare(b.suit.name);
          }
          return a.rank.order - b.rank.order;
        });
        break;

      case 'rank-suit':
        this.cards.sort((a, b) => {
          if (a.rank.order !== b.rank.order) {
            return a.rank.order - b.rank.order;
          }
          return a.suit.name.localeCompare(b.suit.name);
        });
        break;

      case 'color':
        this.cards.sort((a, b) => {
          if (a.suit.color !== b.suit.color) {
            return a.suit.color.localeCompare(b.suit.color);
          }
          return a.compareTo(b);
        });
        break;

      default:
        if (typeof method === 'function') {
          this.cards.sort(method);
        }
    }

    // 선택 상태 복원
    this.restoreSelection(selectedCards);
  }

  /**
   * 카드 위치 교환
   * @param {number} index1
   * @param {number} index2
   * @returns {boolean}
   */
  swapCards(index1, index2) {
    if (!this.isValidIndex(index1) || !this.isValidIndex(index2)) {
      return false;
    }

    [this.cards[index1], this.cards[index2]] = [this.cards[index2], this.cards[index1]];

    // 선택 상태도 교환
    const selected1 = this.selectedIndices.has(index1);
    const selected2 = this.selectedIndices.has(index2);

    if (selected1 !== selected2) {
      if (selected1) {
        this.selectedIndices.delete(index1);
        this.selectedIndices.add(index2);
      } else {
        this.selectedIndices.delete(index2);
        this.selectedIndices.add(index1);
      }
    }

    return true;
  }

  /**
   * 카드 이동
   * @param {number} fromIndex
   * @param {number} toIndex
   * @returns {boolean}
   */
  moveCard(fromIndex, toIndex) {
    if (!this.isValidIndex(fromIndex) || toIndex < 0 || toIndex >= this.cards.length) {
      return false;
    }

    const card = this.cards.splice(fromIndex, 1)[0];
    this.cards.splice(toIndex, 0, card);

    // 선택 상태 유지
    if (this.selectedIndices.has(fromIndex)) {
      this.selectedIndices.delete(fromIndex);
      this.recalculateSelectedIndices();
    }

    return true;
  }

  /**
   * 손패가 가득 찼는지 확인
   * @returns {boolean}
   */
  isFull() {
    return this.cards.length >= this.maxSize;
  }

  /**
   * 손패가 비어있는지 확인
   * @returns {boolean}
   */
  isEmpty() {
    return this.cards.length === 0;
  }

  /**
   * 유효한 인덱스인지 확인
   * @param {number} index
   * @returns {boolean}
   */
  isValidIndex(index) {
    return index >= 0 && index < this.cards.length;
  }

  /**
   * 손패 정보
   * @returns {Object}
   */
  getInfo() {
    return {
      count: this.cards.length,
      maxSize: this.maxSize,
      availableSpace: this.maxSize - this.cards.length,
      selectedCount: this.selectedIndices.size,
      isFull: this.isFull(),
      isEmpty: this.isEmpty(),
    };
  }

  /**
   * 특정 인덱스의 카드 가져오기
   * @param {number} index
   * @returns {Card|null}
   */
  getCard(index) {
    return this.isValidIndex(index) ? this.cards[index] : null;
  }

  /**
   * 모든 카드 가져오기
   * @returns {Card[]}
   */
  getAllCards() {
    return [...this.cards];
  }

  /**
   * 손패 초기화
   */
  clear() {
    this.cards = [];
    this.selectedIndices.clear();
  }

  /**
   * 선택 인덱스 조정 (카드 삽입/제거 시)
   * @private
   */
  adjustSelectedIndices(position, offset) {
    const newIndices = new Set();

    this.selectedIndices.forEach((index) => {
      if (index >= position) {
        newIndices.add(index + offset);
      } else {
        newIndices.add(index);
      }
    });

    this.selectedIndices = newIndices;
  }

  /**
   * 선택 인덱스 재계산
   * @private
   */
  recalculateSelectedIndices() {
    const validIndices = new Set();

    this.selectedIndices.forEach((index) => {
      if (index < this.cards.length) {
        validIndices.add(index);
      }
    });

    this.selectedIndices = validIndices;
  }

  /**
   * 선택 상태 복원
   * @private
   */
  restoreSelection(selectedCards) {
    this.clearSelection();

    selectedCards.forEach((selectedCard) => {
      const index = this.cards.findIndex((card) => card.id === selectedCard.id);
      if (index !== -1) {
        this.selectedIndices.add(index);
      }
    });
  }

  /**
   * 손패 상태 복사
   * @returns {Hand}
   */
  clone() {
    const cloned = new Hand(this.maxSize);
    cloned.cards = this.cards.map((card) => card.clone());
    cloned.selectedIndices = new Set(this.selectedIndices);
    return cloned;
  }
}

// 내보내기
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    Hand,
  };
}
