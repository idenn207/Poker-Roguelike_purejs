// @ts-check

/**
 * 파일위치: /src/managers/card-renderer.js
 * 파일명: card-renderer.js
 * 용도: 카드 렌더링 시스템
 * 기능: 카드 DOM 생성 및 업데이트
 * 책임: 카드 시각적 표현
 */

class CardRenderer {
  constructor() {
    this.cardElements = new Map();
  }

  /**
   * 카드 엘리먼트 생성
   * @param {Card} card
   * @param {boolean} isSmall
   * @returns {HTMLElement}
   */
  createCardElement(card, isSmall = false) {
    const element = document.createElement('div');
    element.className = `card ${isSmall ? 'small' : ''}`;
    element.dataset.cardId = card.id;

    // 색상 설정
    if (card.suit.color === 'red') {
      element.classList.add('red');
    } else {
      element.classList.add('black');
    }

    // 카드 내용
    element.textContent = card.getDisplay();

    // 특수 카드 표시
    if (card.isSpecial) {
      element.classList.add('special');
      element.title = card.getFullDisplay();
    }

    // 이벤트 리스너
    element.addEventListener('click', (e) => this.handleCardClick(e, card));

    this.cardElements.set(card.id, element);
    return element;
  }

  /**
   * 카드 클릭 핸들러
   * @param {Event} event
   * @param {Card} card
   */
  handleCardClick(event, card) {
    const element = event.currentTarget;
    element.classList.toggle('selected');

    // GameManager에 선택 상태 전달
    if (window.gameManager) {
      window.gameManager.handleCardSelection(card, element.classList.contains('selected'));
    }
  }

  /**
   * 손패 렌더링
   * @param {Hand} hand
   * @param {HTMLElement} container
   */
  renderHand(hand, container) {
    // 기존 카드 제거
    container.innerHTML = '';

    // 카드 추가
    hand.getAllCards().forEach((card, index) => {
      const element = this.createCardElement(card);

      // 선택 상태 반영
      if (hand.selectedIndices.has(index)) {
        element.classList.add('selected');
      }

      // 딜 애니메이션
      element.classList.add('deal');
      element.style.animationDelay = `${index * 0.1}s`;

      container.appendChild(element);
    });
  }

  /**
   * 카드 뒷면 생성
   * @param {number} count
   * @param {HTMLElement} container
   */
  renderCardBacks(count, container) {
    container.innerHTML = '';

    for (let i = 0; i < count; i++) {
      const element = document.createElement('div');
      element.className = 'card card-back small';
      container.appendChild(element);
    }
  }

  /**
   * 카드 제거 애니메이션
   * @param {string} cardId
   */
  async removeCard(cardId) {
    const element = this.cardElements.get(cardId);
    if (!element) return;

    element.classList.add('flip');
    await this.wait(600);
    element.remove();
    this.cardElements.delete(cardId);
  }

  /**
   * 대기
   * @param {number} ms
   */
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 모든 카드 제거
   */
  clearAll() {
    this.cardElements.forEach((element) => element.remove());
    this.cardElements.clear();
  }
}
