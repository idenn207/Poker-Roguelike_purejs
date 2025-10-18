/**
 * 요소를 그리는 헬퍼 클래스
 * 다양한 유틸리티 메서드를 제공합니다.
 * @class
 * @example
 * const div = DrawHelper.createElement('div', 'my-class', { color: 'red' });
 * DrawHelper.setPosition(div, 100, 200);
 * document.body.appendChild(div);
 */
class DrawHelper {
  /**
   * 요소 생성
   * @param {string} tag HTML 태그 이름
   * @param {string} className CSS 클래스 이름
   * @param {Object} styles CSS 스타일
   * @returns {HTMLElement} 생성된 요소
   */
  static createElement(tag, className, styles = {}) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    Object.assign(element.style, styles);
    return element;
  }

  // ----- display 설정 ----- //
  /**
   * 요소의 display 속성을 설정합니다.
   * @param {HTMLElement} element display를 설정할 요소
   * @param {string} value display 값
   */
  static setDisplay(element, value) {
    if (element instanceof HTMLElement) {
      element.style.display = value;
    }
  }

  // ----- flex 설정 ----- //
  /**
   * 요소의 flex 속성을 설정합니다.
   * @param {HTMLElement} element flex를 설정할 요소
   * @param {string} align flex 아이템 세로 정렬
   * @param {string} justify flex 아이템 가로 정렬
   * @param {string} direction flex 방향
   * @param {string} wrap flex 래핑
   */
  static setFlex(element, align = 'center', justify = 'center', direction = 'row', wrap = 'nowrap') {
    if (element instanceof HTMLElement) {
      element.style.display = 'flex';
      element.style.alignItems = align;
      element.style.justifyContent = justify;
      element.style.flexDirection = direction;
      element.style.flexWrap = wrap;
    }
  }

  // ----- position 설정 ----- //
  /**
   * 요소의 위치를 설정합니다.
   * @param {HTMLElement} element 위치를 설정할 요소
   * @param {number} x X 좌표
   * @param {number} y Y 좌표
   */
  static setPosition(element, x, y) {
    if (element instanceof HTMLElement) {
      element.style.position = 'absolute';
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
    }
  }

  /**
   * 요소의 위치를 가져옵니다.
   * @param {HTMLElement} element 위치를 가져올 요소
   * @returns {{x: number, y: number}} 요소의 위치
   */
  static getPosition(element) {
    if (element instanceof HTMLElement) {
      const { left, top } = element.getBoundingClientRect();
      return { x: left, y: top };
    }
    return { x: 0, y: 0 };
  }

  /**
   * 요소의 크기를 가져옵니다.
   * @param {HTMLElement} element 크기를 가져올 요소
   * @returns {{width: number, height: number}} 요소의 크기
   */
  static getSize(element) {
    if (element instanceof HTMLElement) {
      const { width, height } = element.getBoundingClientRect();
      return { width, height };
    }
    return { width: 0, height: 0 };
  }

  // ----- child 설정 ----- //
  /**
   * 자식 요소를 추가합니다.
   * @param {HTMLElement} parent 부모요소
   * @param {HTMLElement} child 자식 요소
   */
  static appendChild(parent, child) {
    if (parent instanceof HTMLElement && child instanceof HTMLElement) {
      parent.appendChild(child);
    }
  }

  /**
   * 자식 요소를 제거합니다.
   * @param {HTMLElement} parent 부모요소
   * @param {HTMLElement} child 자식 요소
   */
  static removeChild(parent, child) {
    if (parent instanceof HTMLElement && child instanceof HTMLElement) {
      parent.removeChild(child);
    }
  }

  /**
   * 자식 요소를 교체합니다.
   * @param {HTMLElement} parent 부모요소
   * @param {HTMLElement} oldChild 이전 자식 요소
   * @param {HTMLElement} newChild 새로운 자식 요소
   */
  static replaceChild(parent, oldChild, newChild) {
    if (parent instanceof HTMLElement && oldChild instanceof HTMLElement && newChild instanceof HTMLElement) {
      parent.replaceChild(newChild, oldChild);
    }
  }

  // ----- style 설정 ----- //

  /**
   * 요소의 스타일을 설정합니다.
   * @param {HTMLElement} element 요소
   * @param {Object} styles 스타일 객체
   */
  static setStyles(element, styles = {}) {
    if (element instanceof HTMLElement) {
      Object.assign(element.style, styles);
    }
  }

  /**
   * 태그의 스타일을 가져옵니다.
   * @param {HTMLElement} element 요소
   * @returns {CSSStyleDeclaration} 스타일 객체
   */
  static getStyles(element) {
    if (element instanceof HTMLElement) {
      return getComputedStyle(element);
    }
    return {};
  }
}
