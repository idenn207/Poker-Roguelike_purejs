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
  // ----- 요소 조회 ----- //
  /**
   * 요소 조회 (querySelector)
   * @param {string} selector CSS 선택자
   * @param {HTMLElement} parent 부모 요소 (기본값: document)
   * @returns {HTMLElement|null} 조회된 요소 또는 null
   */
  static getElement(selector, parent = document) {
    if (typeof selector !== 'string') {
      console.error('Selector must be a string');
      return null;
    }
    return parent.querySelector(selector);
  }

  /**
   * 요소 조회 (querySelectorAll)
   * @param {string} selector CSS 선택자
   * @param {HTMLElement} parent 부모 요소 (기본값: document)
   * @returns {NodeList} 조회된 요소 목록
   */
  static getElements(selector, parent = document) {
    if (typeof selector !== 'string') {
      console.error('Selector must be a string');
      return [];
    }
    return parent.querySelectorAll(selector);
  }

  /**
   * 요소 조회 (getElementById)
   * @param {string} id 요소 ID
   * @returns {HTMLElement|null} 조회된 요소 또는 null
   */
  static getElementById(id) {
    return document.getElementById(id);
  }

  // ----- 요소 생성 ----- //
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
   * 모든 자식 요소를 제거합니다.
   * @param {HTMLElement} parent 부모요소
   */
  static removeAllChild(parent) {
    if (parent instanceof HTMLElement) {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
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

  // ----- class 조작 ----- //
  /**
   * 클래스 추가
   * @param {HTMLElement} element 요소
   * @param {string} className 클래스명
   */
  static addClass(element, className) {
    if (element instanceof HTMLElement && typeof className === 'string') {
      element.classList.add(className);
    }
  }

  /**
   * 클래스 제거
   * @param {HTMLElement} element 요소
   * @param {string} className 클래스명
   */
  static removeClass(element, className) {
    if (element instanceof HTMLElement && typeof className === 'string') {
      element.classList.remove(className);
    }
  }

  /**
   * 클래스 토글
   * @param {HTMLElement} element 요소
   * @param {string} className 클래스명
   */
  static toggleClass(element, className) {
    if (element instanceof HTMLElement && typeof className === 'string') {
      element.classList.toggle(className);
    }
  }

  /**
   * 클래스 존재 여부 확인
   * @param {HTMLElement} element 요소
   * @param {string} className 클래스명
   * @returns {boolean} 클래스 존재 여부
   */
  static hasClass(element, className) {
    if (element instanceof HTMLElement && typeof className === 'string') {
      return element.classList.contains(className);
    }
    return false;
  }

  // ----- id 조작 ----- //
  /**
   * 요소의 id 설정
   * @param {HTMLElement} element 요소
   * @param {string} id id 값
   */
  static setId(element, id) {
    if (element instanceof HTMLElement && typeof id === 'string') {
      element.id = id;
    }
  }

  // ----- text 조작 ----- //
  /**
   * 요소의 text 설정
   * @param {HTMLElement} element 요소
   * @param {string} text 텍스트
   */
  static setText(element, text) {
    if (element instanceof HTMLElement && typeof text === 'string') {
      element.textContent = text;
    }
  }

  /**
   * 요소의 html 설정
   * @param {HTMLElement} element 요소
   * @param {string} html HTML 문자열
   */
  static setHTML(element, html) {
    if (element instanceof HTMLElement && typeof html === 'string') {
      element.innerHTML = html;
    }
  }

  // ----- 속성 조작 ----- //
  /**
   * 요소의 disabled 속성 설정
   * @param {HTMLElement} element 요소
   * @param {boolean} disabled disabled 상태
   */
  static setDisabled(element, disabled) {
    if (element instanceof HTMLElement && typeof disabled === 'boolean') {
      element.disabled = disabled;
    }
  }

  /**
   * 속성 설정
   * @param {HTMLElement} element 요소
   * @param {string} name 속성명
   * @param {string} value 속성값
   */
  static setAttribute(element, name, value) {
    if (element instanceof HTMLElement && typeof name === 'string') {
      element.setAttribute(name, value);
    }
  }

  /**
   * 속성 조회
   * @param {HTMLElement} element 요소
   * @param {string} name 속성명
   * @returns {string|null} 속성값
   */
  static getAttribute(element, name) {
    if (element instanceof HTMLElement && typeof name === 'string') {
      return element.getAttribute(name);
    }
    return null;
  }

  /**
   * 속성 제거
   * @param {HTMLElement} element 요소
   * @param {string} name 속성명
   */
  static removeAttribute(element, name) {
    if (element instanceof HTMLElement && typeof name === 'string') {
      element.removeAttribute(name);
    }
  }
}
