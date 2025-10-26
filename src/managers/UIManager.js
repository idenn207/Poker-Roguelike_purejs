/**
 * 파일위치: /src/managers/UIManager.js
 * 파일명: UIManager.js
 * 용도: UI 요소 생성 및 관리
 * 기능: 화면별 UI 요소 동적 생성
 * 책임: UI 렌더링 및 인터랙션 처리
 */

'use strict';
// @ts-check

class UIManager extends ManagerCore {
  constructor(eventBus) {
    super();
    /** @type {EventBus} */
    this.eventBus = eventBus;

    console.debug('UIManager Initialized');
  }

  /** UI 초기화 */
  init() {
    // 각 화면 UI 생성
    this.createLogoScreen();
    this.createLoadingScreen();
    this.createMenuScreen();

    console.debug('UIManager init complete');
  }

  /** UI 이벤트 등록 */
  registerEvents() {
    // 화면 전환 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.SCREEN.CHANGED, this.onScreenChanged.bind(this));

    console.debug('UIManager events registered');
  }

  /**
   * 화면 전환 이벤트 핸들러
   * @param {Object} data 이벤트 데이터
   * @param {string} data.screenName 전환된 화면 이름
   * @param {HTMLElement} data.element 전환된 화면 요소
   */
  onScreenChanged({ screenName, element }) {
    console.debug(`UI screen changed: ${screenName}`);
  }

  /**
   * 로고 화면 UI 생성
   */
  createLogoScreen() {
    const screen = this.draw.createElement('div', 'screen');
    this.draw.setId(screen, 'logoScreen');

    const container = this.draw.createElement('div', 'logo-container');

    // 로고 이미지 (임시 텍스트)
    const logoImage = this.draw.createElement('div', 'logo-image');
    this.draw.setText(logoImage, '🃏');

    // 로고 텍스트
    const logoText = this.draw.createElement('div', 'logo-text');
    this.draw.setText(logoText, 'Poker Roguelike');

    this.draw.appendChild(container, logoImage);
    this.draw.appendChild(container, logoText);
    this.draw.appendChild(screen, container);
    this.draw.appendChild(document.body, screen);

    console.debug('Logo screen created');
  }

  /**
   * 로딩 화면 UI 생성
   */
  createLoadingScreen() {
    const screen = this.draw.createElement('div', 'screen');
    this.draw.setId(screen, 'loadingScreen');

    const container = this.draw.createElement('div', 'loading-container');

    // 스피너
    const spinner = this.draw.createElement('div', 'spinner');

    // 로딩 텍스트
    const loadingText = this.draw.createElement('div', 'loading-text');
    this.draw.setText(loadingText, 'LOADING...');

    // TODO: 프로그래스 바 컨테이너 (나중에 사용)
    const progressContainer = this.draw.createElement('div', 'progress-bar-container');
    const progressFill = this.draw.createElement('div', 'progress-bar-fill');
    this.draw.appendChild(progressContainer, progressFill);

    this.draw.appendChild(container, spinner);
    this.draw.appendChild(container, loadingText);
    this.draw.appendChild(container, progressContainer);
    this.draw.appendChild(screen, container);
    this.draw.appendChild(document.body, screen);

    console.debug('Loading screen created');
  }

  createMenuScreen() {
    const screen = this.draw.createElement('div', 'screen');
    this.draw.setId(screen, 'menuScreen');

    // 정적 요소들
    this.addMenuDecorations(screen);

    // 메인 컨테이너
    const container = this.draw.createElement('div', 'menu-container');

    // 타이틀
    const title = this.draw.createElement('div', 'menu-title');
    this.draw.setText(title, 'Poker Roguelike');

    // 버튼 컨테이너
    const buttonContainer = this.draw.createElement('div', 'menu-buttons');

    // 새 게임 버튼
    const newGameBtn = this.createMenuButton('새 게임', 'new-game-btn', false);
    this.trackDomListener(newGameBtn, EVENTS.DOM.CLICK, () => {
      console.log('New Game clicked');
      this.eventBus.emit(EVENTS.INPUT.BUTTON_CLICKED, { button: 'new-game' });
    });

    // 계속하기 버튼
    const continueBtn = this.createMenuButton('계속하기', 'continue-btn', true);

    // 설정 버튼
    const settingsBtn = this.createMenuButton('설정', 'settings-btn', false, true);
    this.trackDomListener(settingsBtn, EVENTS.DOM.CLICK, () => {
      console.log('Settings clicked');
      this.eventBus.emit(EVENTS.INPUT.BUTTON_CLICKED, { button: 'settings' });
    });

    this.draw.appendChild(buttonContainer, newGameBtn);
    this.draw.appendChild(buttonContainer, continueBtn);
    this.draw.appendChild(buttonContainer, settingsBtn);

    // 푸터
    const footer = this.draw.createElement('div', 'menu-footer');
    this.draw.setText(footer, '© 2025 Poker Roguelike');

    this.draw.appendChild(container, title);
    this.draw.appendChild(container, buttonContainer);
    this.draw.appendChild(container, footer);
    this.draw.appendChild(screen, container);
    this.draw.appendChild(document.body, screen);

    console.debug('Menu screen created');
  }

  /**
   * 메뉴 버튼 생성
   * @param {string} text 버튼 텍스트
   * @param {string} id 버튼 ID
   * @param {boolean} disabled 비활성화 여부
   * @param {boolean} secondary 세컨더리 스타일 여부
   * @returns {HTMLElement} 생성된 버튼 요소
   */
  createMenuButton(text, id, disabled = false, secondary = false) {
    const button = this.draw.createElement('button', 'menu-btn');
    this.draw.setId(button, id);
    this.draw.setText(button, text);
    this.draw.setAttribute(button, 'disabled', disabled);

    if (secondary) {
      this.draw.addClass(button, 'secondary');
    }

    return button;
  }

  /**
   * 메뉴 장식 요소 추가
   * @param {HTMLElement} screen
   */
  addMenuDecorations(screen) {
    // 카드 장식
    const positions = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    positions.forEach((pos) => {
      const card = this.draw.createElement('div', 'card-decoration');
      this.draw.addClass(card, pos);
      this.draw.appendChild(screen, card);
    });

    // 칩 장식
    const chipTop = this.draw.createElement('div', 'chip-decoration');
    this.draw.addClass(chipTop, 'top');
    this.draw.appendChild(screen, chipTop);

    const chipBottom = this.draw.createElement('div', 'chip-decoration');
    this.draw.addClass(chipBottom, 'bottom');
    this.draw.appendChild(screen, chipBottom);
  }

  update(deltaTime) {}
}
