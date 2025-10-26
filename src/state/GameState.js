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
     * @type {keyof SCREEN_STATE_TYPE} 화면 상태
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

    console.log('GameState Initialized');
  }
}
