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
    /**
     * @type {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} 화면 상태
     */
    this.currentScreen = 'logo';

    // 게임 진행도
    this.stage = {
      current: 1,
      maxReached: 1,
      type: null, // 'monster' | 'elite' | 'boss' | 'rest' | 'treasure' | 'shop'
    };

    // 플레이어 데이터
    this.player = {
      hp: 100,
      maxHp: 100,
      coins: 250,
      items: [],
    };

    // 게임 설정
    this.settings = {
      debug: false,
      volume: 0.5,
      difficulty: 'normal', // 'easy' | 'normal' | 'hard'
    };

    // 게임 상태
    this.isGameActive = false;
    this.isPaused = false;

    console.debug('GameState Initialized');
  }

  setCurrentScreen(screen) {
    this.currentScreen = screen;
  }

  setCurrentStage(stage) {
    this.stage.current = stage;
  }

  setCurrentPlayer(player) {
    this.player = player;
  }

  setCurrentSettings(settings) {
    this.settings = settings;
  }

  getCurrentScreen() {
    return this.currentScreen;
  }

  getCurrentStage() {
    return this.stage.current;
  }

  getCurrentPlayer() {
    return this.player;
  }

  getCurrentSettings() {
    return this.settings;
  }

  getCurrentGameState() {
    return {
      screen: this.getCurrentScreen(),
      stage: this.getCurrentStage(),
      player: this.getCurrentPlayer(),
      settings: this.getCurrentSettings(),
    };
  }
}
