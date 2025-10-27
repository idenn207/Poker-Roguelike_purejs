/**
 * 파일 위치: /src/state/DebugState.js
 * 파일명: DebugState.js
 * 용도: Debug 상태 관리
 * 기능: Debug 패널 상태 데이터 저장
 * 책임: Debug 관련 상태 데이터만 관리
 */

class DebugState {
  constructor() {
    /** @type {boolean} Debug 패널 활성화 여부 */
    this.isActive = false;

    /** @type {string} 현재 선택된 탭 */
    this.currentTab = 'events';

    /**
     * @typedef {Object} LoopInfo 게임 루프 정보 타입
     * @property {number} fps 초당 프레임 수
     * @property {number} deltaTime 델타 타임
     * @property {number} totalTime 총 플레이 시간
     * @property {number} frameCount 프레임 수
     * @property {number} avgFps 평균 프레임 수
     * @property {boolean} running 게임 루프 실행 중 여부
     * @property {boolean} paused 게임 루프 일시 정지 여부
     */
    /** @type {LoopInfo} 게임 루프 정보 */
    this.loopInfo = {
      fps: 0,
      deltaTime: 0,
      totalTime: 0,
      frameCount: 0,
      avgFps: 0,
      running: false,
      paused: false,
    };

    /** @type {Array<number>} FPS 히스토리 */
    this.fpsHistory = [];

    /** @type {number} 최대 FPS 히스토리 크기 */
    this.maxFpsHistory = 60;

    /** @type {Array<Object>} 이벤트 로그 (실시간 표시용) */
    this.recentEvents = [];

    /** @type {number} 최대 최근 이벤트 개수 */
    this.maxRecentEvents = 50;

    /** @type {boolean} Debug 패널 축소 여부 */
    this.isCollapsed = false;

    console.debug('DebugState Initialized');
  }

  /**
   * Debug 패널 활성화 여부 조회
   * @returns {boolean}
   */
  isDebugActive() {
    return this.isActive;
  }

  /**
   * 현재 탭 조회
   * @returns {string}
   */
  getCurrentTab() {
    return this.currentTab;
  }

  /**
   * 게임 루프 정보 조회
   * @returns {LoopInfo}
   */
  getLoopInfo() {
    return { ...this.loopInfo };
  }

  /**
   * FPS 히스토리 조회
   * @returns {Array<number>}
   */
  getFpsHistory() {
    return [...this.fpsHistory];
  }

  /**
   * 최근 이벤트 조회
   * @returns {Array<Object>}
   */
  getRecentEvents() {
    return [...this.recentEvents];
  }
}
