/**
 * 파일위치: /src/managers/UIManager.js (추가할 메서드)
 * 파일명: UIManager_BattleScreen.js
 * 용도: 전투 화면 HTML 생성
 * 기능: 카지노 포커 테이블 테마 전투 UI
 * 책임: 전투 화면 DOM 생성
 */

class BattleScreen extends UICore {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;
  }

  /**
   * 전투 화면 UI 생성 (포커 테이블 테마)
   */
  createBattleScreen() {
    const screen = this._draw.createElement('div', 'screen');
    this._draw.setId(screen, 'battleScreen');

    // 포커 테이블 배경
    const tableOverlay = this._draw.createElement('div', 'poker-table-bg');
    this._draw.appendChild(screen, tableOverlay);

    // 메인 컨테이너
    const container = this._draw.createElement('div', 'battle-container');

    // ========================================
    // 플레이어 정보 (좌측 상단)
    // ========================================
    const playerZone = this._draw.createElement('div', 'player-zone');

    const playerCard = this._draw.createElement('div', 'combatant-card player');

    const playerAvatar = this._draw.createElement('div', 'combatant-avatar');
    this._draw.setText(playerAvatar, '🤠');

    const playerName = this._draw.createElement('div', 'combatant-name');
    this._draw.setText(playerName, '플레이어');
    this._draw.setId(playerName, 'battlePlayerName');

    const playerHpBar = this._draw.createElement('div', 'hp-bar-container');
    const playerHpFill = this._draw.createElement('div', 'hp-bar-fill');
    this._draw.addStyle(playerHpFill, { width: '100%' });
    const playerHpText = this._draw.createElement('div', 'hp-bar-text');
    this._draw.setText(playerHpText, '100/100');
    this._draw.setId(playerHpText, 'battlePlayerHp');

    this._draw.appendChild(playerHpBar, playerHpFill);
    this._draw.appendChild(playerHpBar, playerHpText);

    this._draw.appendChild(playerCard, playerAvatar);
    this._draw.appendChild(playerCard, playerName);
    this._draw.appendChild(playerCard, playerHpBar);

    this._draw.appendChild(playerZone, playerCard);

    // ========================================
    // 적 정보 (우측 상단)
    // ========================================
    const enemyZone = this._draw.createElement('div', 'enemy-zone');

    const enemyCard = this._draw.createElement('div', 'combatant-card enemy');

    const enemyAvatar = this._draw.createElement('div', 'combatant-avatar');
    this._draw.setText(enemyAvatar, '👹');

    const enemyName = this._draw.createElement('div', 'combatant-name');
    this._draw.setText(enemyName, '와일드 겜블러');
    this._draw.setId(enemyName, 'battleEnemyName');

    const enemyHpBar = this._draw.createElement('div', 'hp-bar-container');
    const enemyHpFill = this._draw.createElement('div', 'hp-bar-fill enemy');
    this._draw.addStyle(enemyHpFill, { width: '80%' });
    const enemyHpText = this._draw.createElement('div', 'hp-bar-text');
    this._draw.setText(enemyHpText, '80/100');
    this._draw.setId(enemyHpText, 'battleEnemyHp');

    this._draw.appendChild(enemyHpBar, enemyHpFill);
    this._draw.appendChild(enemyHpBar, enemyHpText);

    // 적 의도 표시
    const enemyIntent = this._draw.createElement('div', 'enemy-intent');
    this._draw.setText(enemyIntent, '⚔️ 공격: 15');
    this._draw.setId(enemyIntent, 'battleEnemyIntent');

    this._draw.appendChild(enemyCard, enemyAvatar);
    this._draw.appendChild(enemyCard, enemyName);
    this._draw.appendChild(enemyCard, enemyHpBar);
    this._draw.appendChild(enemyCard, enemyIntent);

    this._draw.appendChild(enemyZone, enemyCard);

    // ========================================
    // 중앙 전투 영역
    // ========================================
    const battleZone = this._draw.createElement('div', 'battle-zone');

    // 전투 로그/상태
    const battleInfo = this._draw.createElement('div', 'battle-info');

    const turnCounter = this._draw.createElement('div', 'turn-counter');
    this._draw.setText(turnCounter, '턴 1');
    this._draw.setId(turnCounter, 'battleTurnCounter');

    const battleLog = this._draw.createElement('div', 'battle-log');
    this._draw.setId(battleLog, 'battleLog');
    this._draw.setText(battleLog, '🎲 게임이 시작되었습니다...');

    this._draw.appendChild(battleInfo, turnCounter);
    this._draw.appendChild(battleInfo, battleLog);

    // 카드 에리어 (손패)
    const handArea = this._draw.createElement('div', 'hand-area');
    this._draw.setId(handArea, 'battleHandArea');

    // 데모용 카드들
    for (let i = 0; i < 5; i++) {
      const card = this.#createBattleCard(i);
      this._draw.appendChild(handArea, card);
    }

    this._draw.appendChild(battleZone, battleInfo);
    this._draw.appendChild(battleZone, handArea);

    // ========================================
    // 하단 액션 버튼
    // ========================================
    const battleActions = this._draw.createElement('div', 'battle-actions');

    const playHandBtn = this._draw.createElement('button', 'battle-action-btn primary');
    this._draw.setText(playHandBtn, '🎰 플레이');
    this._draw.setId(playHandBtn, 'playHandBtn');

    const dropCardsBtn = this._draw.createElement('button', 'battle-action-btn');
    this._draw.setText(dropCardsBtn, '🃏 버리기 (3/3)');
    this._draw.setId(dropCardsBtn, 'dropCardsBtn');

    const endTurnBtn = this._draw.createElement('button', 'battle-action-btn danger');
    this._draw.setText(endTurnBtn, '⏭️ 턴 종료');
    this._draw.setId(endTurnBtn, 'endTurnBtn');

    this._draw.appendChild(battleActions, playHandBtn);
    this._draw.appendChild(battleActions, dropCardsBtn);
    this._draw.appendChild(battleActions, endTurnBtn);

    // ========================================
    // 조립
    // ========================================
    this._draw.appendChild(container, playerZone);
    this._draw.appendChild(container, enemyZone);
    this._draw.appendChild(container, battleZone);
    this._draw.appendChild(container, battleActions);

    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug('Battle screen created');
  }

  /**
   * 전투 카드 생성 (데모용)
   * @param {number} index 카드 인덱스
   * @returns {HTMLElement}
   */
  #createBattleCard(index) {
    const suits = ['♠', '♥', '♦', '♣'];
    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    const suit = suits[index % suits.length];
    const rank = ranks[index % ranks.length];
    const isRed = suit === '♥' || suit === '♦';

    const card = this._draw.createElement('div', 'playing-card');
    if (isRed) this._draw.addClass(card, 'red');

    const cardRank = this._draw.createElement('div', 'card-rank');
    this._draw.setText(cardRank, rank);

    const cardSuit = this._draw.createElement('div', 'card-suit');
    this._draw.setText(cardSuit, suit);

    this._draw.appendChild(card, cardRank);
    this._draw.appendChild(card, cardSuit);

    return card;
  }
}
