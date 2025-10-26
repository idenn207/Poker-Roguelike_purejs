// @ts-check

/**
 * 파일위치: /src/managers/screen-manager.js
 * 파일명: screen-manager.js
 * 용도: 화면 전환 관리
 * 기능: 화면 표시/숨김, 전환 애니메이션
 * 책임: UI 화면 관리
 */

class ScreenManager {
  /**
   * @constructor
   * @param {EventBus} eventBus 이벤트 버스 객체
   */
  constructor(eventBus) {
    /**
     * 이벤트 버스 객체
     * @type {EventBus}
     */
    this.eventBus = eventBus;

    /**
     * 화면 요소 맵
     */
    this.screens = {
      logo: document.getElementById('logoScreen'),
      loading: document.getElementById('loadingScreen'),
      menu: document.getElementById('menuScreen'),
      pause: document.getElementById('pauseScreen'),
      setting: document.getElementById('settingScreen'),
      stage: document.getElementById('stageSelectScreen'),
      battle: document.getElementById('battleScreen'),
      reward: document.getElementById('rewardScreen'),
      gameover: document.getElementById('gameoverScreen'),
    };

    /** 현재 화면 */
    this.currentScreen = null;

    /** 전환중 여부 */
    this.isTransitioning = false;

    console.debug('ScreenManager Initialized');
  }

  /**
   * 화면 초기화 + 이벤트 버스 등록
   */
  init() {
    // 화면 이벤트 등록

    // 초기 화면 설정
    this.eventBus.emit('screen:state:change', 'loading');
  }

  /**
   * 화면 전환
   * @param {string} screenName 화면 이름
   * @param {boolean} showLoading 로딩 화면 표시 여부
   */
  async show(screenName, showLoading = true) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 현재 화면 페이드 아웃
    if (this.currentScreen) {
      this.currentScreen.classList.remove('show');
      // await this.wait(500);
    }

    // 로딩 화면 표시 (필요시)
    if (showLoading && screenName !== 'loading') {
      this.screens.loading.classList.add('show');
      // await this.#wait(1000);
      this.screens.loading.classList.remove('show');
      // await this.#wait(500);
    }

    // 새 화면 표시
    const newScreen = this.screens[screenName];
    if (newScreen) {
      newScreen.classList.add('show');
      this.currentScreen = newScreen;
    }

    this.isTransitioning = false;
  }

  /**
   * 대기
   * @param {number} ms
   */
  #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
