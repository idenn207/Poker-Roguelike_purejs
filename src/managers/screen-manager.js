// @ts-check

/**
 * 파일위치: /src/managers/screen-manager.js
 * 파일명: screen-manager.js
 * 용도: 화면 전환 관리
 * 기능: 화면 표시/숨김, 전환 애니메이션
 * 책임: UI 화면 관리
 */

class ScreenManager {
  constructor() {
    this.screens = {
      logo: document.getElementById('logoScreen'),
      loading: document.getElementById('loadingScreen'),
      menu: document.getElementById('menuScreen'),
      stageSelect: document.getElementById('stageSelectScreen'),
      battle: document.getElementById('battleScreen'),
      reward: document.getElementById('rewardScreen'),
    };

    this.currentScreen = null;
    this.isTransitioning = false;
  }

  /**
   * 화면 전환
   * @param {string} screenName
   * @param {boolean} showLoading
   */
  async switchTo(screenName, showLoading = true) {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // 현재 화면 페이드 아웃
    if (this.currentScreen) {
      this.currentScreen.classList.remove('show');
      await this.wait(500);
    }

    // 로딩 화면 표시 (필요시)
    if (showLoading && screenName !== 'loading' && screenName !== 'logo') {
      this.screens.loading.classList.add('show');
      await this.wait(1000);
      this.screens.loading.classList.remove('show');
      await this.wait(500);
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
  wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 초기화
   */
  async initialize() {
    // 로고 화면 표시
    await this.switchTo('logo', false);
    await this.wait(1000);

    // 메뉴 화면으로 전환
    await this.switchTo('menu', false);
  }
}
