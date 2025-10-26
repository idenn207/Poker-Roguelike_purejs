/**
 * 파일위치: /src/managers/ScreenManager.js
 * 파일명: ScreenManager.js
 * 용도: 화면 전환 관리
 * 기능: 화면 표시/숨김, 전환 애니메이션 제어
 * 책임: UI 화면 전환 관리, 이벤트 발행
 */

class ScreenManager extends ManagerCore {
  /**
   * @constructor
   * @param {EventBus} eventBus 이벤트 버스 객체
   */
  constructor(eventBus) {
    super();

    /**
     * 이벤트 버스 객체
     * @type {EventBus}
     */
    this.eventBus = eventBus;

    /**
     * 화면 요소 맵
     * @type {Object.<string, HTMLElement>}
     */
    this.screens = {};

    /**
     * 현재 화면
     * @type {HTMLElement|null}
     */
    this.currentScreen = null;

    /**
     * 전환중 여부
     * @type {boolean}
     */
    this.isTransitioning = false;

    /**
     * 화면 전환 완료 대기 시간 (ms)
     * @type {number}
     */
    this.transitionDuration = 500;

    console.debug('ScreenManager Initialized');
  }

  /**
   * 화면 초기화 + 이벤트 버스 등록
   */
  init() {
    // 화면 요소 초기화 (UIManager 가 생성한 요소 연결)
    this.screens = {
      logo: this.draw.getElement('#logoScreen'),
      loading: this.draw.getElement('#loadingScreen'),
      menu: this.draw.getElement('#menuScreen'),
      characterSelect: this.draw.getElement('#characterSelectScreen'),
      pause: this.draw.getElement('#pauseScreen'),
      setting: this.draw.getElement('#settingScreen'),
      stage: this.draw.getElement('#stageScreen'),
      battle: this.draw.getElement('#battleScreen'),
      reward: this.draw.getElement('#rewardScreen'),
      gameover: this.draw.getElement('#gameoverScreen'),
    };

    // 초기 화면 표시 (logo)
    this.showLogoScreen();

    console.debug('ScreenManager init complete');
  }

  /** 이벤트 등록 */
  registerEvents() {
    // 상태 변경 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.SCREEN.CHANGED, this.onStateChanged.bind(this));

    console.debug('ScreenManager events registered');
  }

  /**
   * 상태 변경 이벤트 핸들러
   * @param {Object} data
   * @param {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} data.previous 이전 화면 이름
   * @param {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} data.current 현재 화면 이름
   */
  onStateChanged(data) {
    const { previous, current } = data;
    this.show(current);
  }

  /**
   * 화면 전환
   * @param {string} screenName 전환할 화면 이름
   * @returns {Promise<void>}
   */
  async show(screenName) {
    if (this.isTransitioning) {
      console.warn('Screen transition already in progress');
      return;
    }

    console.debug('this.screens: ', this.screens);
    const newScreen = this.screens[screenName];
    if (!newScreen) {
      console.error(`Screen not found: ${screenName}`);
      return;
    }

    this.isTransitioning = true;

    console.debug(`Screen transition start: ${screenName}`);

    // 현재 화면 페이드 아웃
    if (this.currentScreen) {
      await this.hideScreen(this.currentScreen);
    }

    // 새 화면 페이드 인
    await this.showScreen(newScreen);

    this.currentScreen = newScreen;
    this.isTransitioning = false;

    // 화면 전환 완료 이벤트 발행
    this.eventBus.emit(EVENTS.SCREEN.CHANGED, {
      screenName: screenName,
      element: newScreen,
    });

    console.debug(`Screen transition complete: ${screenName}`);

    // 특정 화면 전환 시 다음 단계 자동 진행
    this.handleAutoTransition(screenName);
  }

  /**
   * 화면 표시
   * @param {HTMLElement} screen
   * @returns {Promise<void>}
   */
  showScreen(screen) {
    return new Promise((resolve, reject) => {
      // show 클래스 추가
      this.draw.addClass(screen, 'show');

      // transitionend 이벤트 대기
      const onTransitionEnd = () => {
        this.cleanupListenersByType(EVENTS.DOM.TRANSITION_END);
        resolve();
      };

      this.trackDomListener(screen, EVENTS.DOM.TRANSITION_END, onTransitionEnd);

      // 안전장치: transition이 없을 경우 타임아웃
      setTimeout(() => {
        this.cleanupListenersByType(EVENTS.DOM.TRANSITION_END);
        resolve();
      }, this.transitionDuration + 100);
    });
  }

  /**
   * 로고 화면 표시 (초기 진입시)
   */
  showLogoScreen() {
    const logoScreen = this.screens.logo;
    if (logoScreen) {
      this.draw.addClass(logoScreen, 'show');
      this.currentScreen = logoScreen;

      // 자동 전환 시작
      this.handleAutoTransition(SCREEN_STATE_TYPE.LOGO);
    }
  }

  hideScreen(screen) {
    return new Promise((resolve, reject) => {
      // hide 클래스 추가
      this.draw.removeClass(screen, 'show');

      // transitionend 이벤트 대기
      const onTransitionEnd = () => {
        this.cleanupListenersByType(EVENTS.DOM.TRANSITION_END);
        resolve();
      };

      this.trackDomListener(screen, EVENTS.DOM.TRANSITION_END, onTransitionEnd);

      // 안전장치: transition이 없을 경우 타임아웃
      setTimeout(() => {
        this.cleanupListenersByType(EVENTS.DOM.TRANSITION_END);
        resolve();
      }, this.transitionDuration + 100);
    });
  }

  /**
   * 자동 화면 전환 처리
   * @param {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} screenName
   */
  handleAutoTransition(screenName) {
    switch (screenName) {
      case SCREEN_STATE_TYPE.LOGO: {
        // 로고 화면 2초 후 로딩 화면으로
        setTimeout(() => {
          this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
            screenName: SCREEN_STATE_TYPE.LOADING,
          });
        }, 2000);
        break;
      }
      case SCREEN_STATE_TYPE.LOADING: {
        // 로딩 화면 1.5초 후 메뉴 화면으로
        setTimeout(() => {
          this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
            screenName: SCREEN_STATE_TYPE.MENU,
          });
        }, 1500);
        break;
      }
      default: {
        // 다른 화면은 자동 전환 없음
        break;
      }
    }
  }

  update(deltaTime) {}
}
