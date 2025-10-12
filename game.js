'use strict';
// @ts-check

/**
 * 파일위치: /game.js (인라인)
 * 파일명: game.js
 * 용도: 게임 초기화 및 기본 인터랙션
 * 기능: 이벤트 처리, 상태 관리 기초
 * 책임: 사용자 입력 처리 및 UI 업데이트
 */

// 상태 관리 (Single Source of Truth)
const gameState = {
  score: 0,
  stage: { level: 1, round: 1 },
  selectedCards: new Set(),
  currentState: 'WAITING',
  debugMode: false,
};

// 통합 이벤트 처리 (마우스/터치)
function setupEventHandlers() {
  const cards = document.querySelectorAll('.card');

  cards.forEach((card) => {
    // 통합 이벤트 핸들러
    const handleInteraction = (e) => {
      e.preventDefault();
      if (card.classList.contains('card-back')) return;

      card.classList.toggle('selected');

      // 상태 업데이트
      if (card.classList.contains('selected')) {
        gameState.selectedCards.add(card);
      } else {
        gameState.selectedCards.delete(card);
      }

      updateDebugInfo();
    };

    // 마우스 이벤트
    card.addEventListener('click', handleInteraction);

    // 터치 이벤트
    card.addEventListener('touchend', handleInteraction);
  });
}

// UI 제어 함수들
function toggleSettings() {
  const modal = document.getElementById('settingsModal');
  modal.classList.toggle('show');
}

function closeSettings() {
  const modal = document.getElementById('settingsModal');
  modal.classList.remove('show');
}

function toggleDebug() {
  const debugPanel = document.getElementById('debugPanel');
  debugPanel.classList.toggle('show');
  gameState.debugMode = !gameState.debugMode;
  updateDebugInfo();
}

function updateDebugInfo() {
  if (!gameState.debugMode) return;

  const debugPanel = document.getElementById('debugPanel');
  const isTouchDevice = 'ontouchstart' in window;

  debugPanel.innerHTML = `
                <div>== Debug Info ==</div>
                <div>FPS: ${Math.round(1000 / 16.7)}</div>
                <div>Cards: ${document.querySelectorAll('.card').length}</div>
                <div>Selected: ${gameState.selectedCards.size}</div>
                <div>State: ${gameState.currentState}</div>
                <div>Touch: ${isTouchDevice}</div>
                <div>Stage: ${gameState.stage.level}-${gameState.stage.round}</div>
            `;
}

function playHand() {
  console.log('Playing hand with', gameState.selectedCards.size, 'cards');
  // 게임 로직 구현 예정
}

function discardCards() {
  console.log('Discarding', gameState.selectedCards.size, 'cards');
  // 게임 로직 구현 예정
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  setupEventHandlers();

  // 모달 배경 클릭으로 닫기
  document.getElementById('settingsModal').addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      closeSettings();
    }
  });
});

// 뷰포트 높이 수정 (모바일 브라우저 대응)
function setViewportHeight() {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
setViewportHeight();
