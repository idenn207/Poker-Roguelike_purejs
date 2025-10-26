/**
 * 파일 위치: src/state/GameState.js
 * 파일명: GameState.js
 * 용도: 전역 게임 상태 관리
 * 기능: 게임 상태 데이터 저장 및 접근
 * 책임: 상태 데이터만 관리 (로직은 Manager가 처리)
 */

'use strict';
// @ts-check

class GameState {
  constructor() {
    // ========================================
    // 화면 상태
    // ========================================
    /**
     * @type {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 화면 상태
     */
    this.currentScreen = 'logo';
    /**
     * @type {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 이전 화면 상태
     */
    this.previousScreen = null;

    // ========================================
    // 캐릭터 선택 상태
    // ========================================

    /** 캐릭터 선택 상태 */
    /**
     * @type {Array<typeof CHARACTERS[keyof typeof CHARACTERS]>} 사용 가능한 캐릭터 목록
     */
    this.availableCharacters = Object.values(CHARACTERS);

    /**
     * @type {number} 현재 선택된 캐릭터 인덱스
     */
    this.currentCharacterIndex = 0;

    /**
     * @type {Object|null} 최종 선택된 캐릭터
     */
    this.selectedCharacter = null;

    // ========================================
    // 게임 진행도
    // ========================================
    /**
     * @typedef {Object} StageInfoType 현재 스테이지 정보
     * @property {number} current 현재 스테이지 번호
     * @property {number} maxReached 도달한 최대 스테이지 번호
     * @property {string|null} type 현재 스테이지 타입
     */
    /** @type {StageInfoType} 스테이지 정보 */
    this.stage = {
      current: 1,
      maxReached: 1,
      type: null, // 'monster' | 'elite' | 'boss' | 'rest' | 'treasure' | 'shop'
    };

    // ========================================
    // 플레이어 데이터
    // ========================================
    /**
     * @typedef {Object} PlayerDataType 플레이어 데이터 타입
     * @property {typeof CHARACTERS[keyof typeof CHARACTERS] | null} character 선택 캐릭터 정보
     * @property {number} hp 체력
     * @property {number} maxHp 최대 체력
     * @property {number} golds 골드
     * @property {Array<Item>} items 아이템 목록
     * @property {Deck | null} deck 덱
     * @property {Array<Relic>} relics 유물 목록
     */
    /** @type {PlayerDataType} 플레이어 데이터 */
    this.player = {
      character: null,
      hp: 100,
      maxHp: 100,
      golds: 250,
      items: [],
      deck: null,
      relics: [],
    };

    // ========================================
    // 전투 상태
    // ========================================

    /**
     * @typedef {Object} CombatStateType 전투 상태 타입
     * @property {boolean} isActive: 전투 활성화 상태
     * @property {Array<Enemy>} enemies: 적 목록
     * @property {number} turn: 현재 턴
     * @property {boolean} playerTurn: 플레이어 턴 여부
     */
    /** @type {CombatStateType} 전투 상태 */
    this.combat = {
      isActive: false,
      enemies: [],
      turn: 0,
      playerTurn: true,
    };

    // ========================================
    // 게임 설정
    // ========================================
    /**
     * @typedef {Object} GameSettingsType 게임 설정
     * @property {boolean} debug
     * @property {number} volume
     * @property {'easy' | 'normal' | 'hard'} difficulty
     */
    /** @type {GameSettingsType} 게임 설정 */
    this.settings = {
      debug: false,
      volume: 0.5,
      difficulty: 'normal', // 'easy' | 'normal' | 'hard'
    };

    // ========================================
    // 게임 상태
    // ========================================
    /** @type {boolean} 게임 활성화 상태 */
    this.isGameActive = false;

    /** @type {boolean} 게임 일시 정지 상태 */
    this.isPaused = false;

    /** @type {boolean} 새로운 게임 상태 */
    this.isNewGame = false;

    console.debug('GameState Initialized');
  }

  // ========================================
  // 화면 상태 접근자
  // ========================================
  /**
   * 현재 화면 조회
   * @returns {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 현재 화면 상태
   */
  getCurrentScreen() {
    return this.currentScreen;
  }

  /**
   * 이전 화면 조회
   * @returns {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 이전 화면 상태
   */
  getPreviousScreen() {
    return this.previousScreen;
  }

  // ========================================
  // 캐릭터 상태 접근자
  // ========================================

  /**
   * 현재 선택 중인 캐릭터 조회
   * @returns {typeof CHARACTERS[keyof typeof CHARACTERS]} 현재 선택된 캐릭터
   */
  getCurrentCharacter() {
    return this.availableCharacters[this.currentCharacterIndex];
  }

  /**
   * 현재 캐릭터 인덱스 조회
   * @returns {number} 현재 캐릭터 인덱스
   */
  getCurrentCharacterIndex() {
    return this.currentCharacterIndex;
  }

  /**
   * 최종 선택된 캐릭터 조회
   * @returns {typeof CHARACTERS[keyof typeof CHARACTERS]} 최종 선택된 캐릭터
   */
  getSelectedCharacter() {
    return this.selectedCharacter;
  }

  /**
   * 사용 가능한 캐릭터 목록 조회
   * @returns {Array<typeof CHARACTERS[keyof typeof CHARACTERS]>} 사용 가능한 캐릭터 목록
   */
  getAvailableCharacters() {
    return this.availableCharacters;
  }

  // ========================================
  // 플레이어 데이터 접근자
  // ========================================
  /**
   * 플레이어 정보 조회
   * @returns {Object} 플레이어 정보
   */
  getPlayer() {
    return this.player;
  }

  // ========================================
  // 게임 상태 접근자
  // ========================================
  /**
   * 게임 활성화 상태 조회
   * @returns {boolean} 게임 활성화 상태
   */
  isActive() {
    return this.isGameActive;
  }

  /**
   * 게임 일시 정지 상태 조회
   * @returns {boolean} 게임 일시 정지 상태
   */
  paused() {
    return this.isPaused;
  }
}
