/**
 * 파일위치: /src/managers/StateManager.js
 * 파일명: StateManager.js
 * 용도: 게임 상태 관리
 * 기능: 화면 상태, 게임 진행 상태 관리
 * 책임: 전역 상태 데이터 관리 및 상태 변경 이벤트 처리
 */

class StateManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    /** @type {GameState} */
    this.gameState = new GameState();
  }

  /** 게임 상태 초기화 */
  init() {
    console.debug('StateManager init complete - Initial screen: logo');
  }

  /** 게임 상태 이벤트 등록 */
  registerEvents() {
    this.trackEventBusListener(this.eventBus, EVENTS.SCREEN.CHANGED, this.onScreenChanged.bind(this));
  }

  /**
   * 화면 상태 변경
   * @param {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} screenName
   */
  changeScreen(screenName) {
    const prevScreen = this.gameState.currentScreen;
    this.gameState.currentScreen = screenName;

    console.debug(`Screen state changed: ${prevScreen} -> ${screenName}`);

    this.eventBus.emit(EVENTS.STATE.CHANGED, {
      type: EVENTS.TYPE.SCREEN,
      previous: prevScreen,
      current: screenName,
    });
  }

  /**
   * 화면 변경 완료 이벤트 핸들러
   * @param {Object} data
   */
  onScreenChanged(data) {
    console.debug('Screen changed event received:', data);
  }

  /**
   * 현재 화면 상태 조회
   * @returns {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 현재 게임 상태
   */
  getCurrentScreen() {
    return this.gameState.currentScreen;
  }

  update(deltaTime) {
    // 상태 업데이트 로직
  }
}
