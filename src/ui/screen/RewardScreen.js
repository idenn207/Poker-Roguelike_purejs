/**
 * 파일위치: /src/managers/UIManager.js (추가할 메서드)
 * 파일명: UIManager_RewardScreen.js
 * 용도: 보상 화면 HTML 생성
 * 기능: 슬롯머신/보물 상자 테마 보상 UI
 * 책임: 보상 화면 DOM 생성
 */
class RewardScreen extends UICore {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;
  }
  /**
   * 보상 화면 UI 생성 (슬롯머신 테마)
   */
  createRewardScreen() {
    const screen = this._draw.createElement('div', 'screen');
    this._draw.setId(screen, 'rewardScreen');

    // 축하 배경 효과
    const bgEffect = this._draw.createElement('div', 'reward-bg-effect');
    this._draw.appendChild(screen, bgEffect);

    // 메인 컨테이너
    const container = this._draw.createElement('div', 'reward-container');

    // ========================================
    // 상단 승리 메시지
    // ========================================
    const header = this._draw.createElement('div', 'reward-header');

    const victoryBanner = this._draw.createElement('div', 'victory-banner');
    this._draw.setText(victoryBanner, '🎉 잭 팟! 🎉');

    const victoryText = this._draw.createElement('div', 'victory-text');
    this._draw.setText(victoryText, '당신이 이겼습니다!');

    this._draw.appendChild(header, victoryBanner);
    this._draw.appendChild(header, victoryText);

    // ========================================
    // 보상 통계
    // ========================================
    const rewardStats = this._draw.createElement('div', 'reward-stats');

    const goldEarned = this._draw.createElement('div', 'reward-stat-item');
    this._draw.setHTML(
      goldEarned,
      '<span class="stat-icon">💰</span><span class="stat-label">획득한 골드</span><span class="stat-value" id="rewardGold">+50</span>'
    );

    const damageDealt = this._draw.createElement('div', 'reward-stat-item');
    this._draw.setHTML(damageDealt, '<span class="stat-icon">⚔️</span><span class="stat-label">입힌 피해</span><span class="stat-value">75</span>');

    const turnsUsed = this._draw.createElement('div', 'reward-stat-item');
    this._draw.setHTML(turnsUsed, '<span class="stat-icon">🔄</span><span class="stat-label">사용한 턴</span><span class="stat-value">5</span>');

    this._draw.appendChild(rewardStats, goldEarned);
    this._draw.appendChild(rewardStats, damageDealt);
    this._draw.appendChild(rewardStats, turnsUsed);

    // ========================================
    // 보상 선택 영역
    // ========================================
    const rewardContent = this._draw.createElement('div', 'reward-content');

    const rewardTitle = this._draw.createElement('div', 'reward-section-title');
    this._draw.setText(rewardTitle, '🎁 보상을 선택하세요');

    const rewardGrid = this._draw.createElement('div', 'reward-grid');
    this._draw.setId(rewardGrid, 'rewardGrid');

    // 데모용 보상 카드들
    for (let i = 0; i < 3; i++) {
      const rewardCard = this.#createRewardCard(i);
      this._draw.appendChild(rewardGrid, rewardCard);
    }

    this._draw.appendChild(rewardContent, rewardTitle);
    this._draw.appendChild(rewardContent, rewardGrid);

    // ========================================
    // 추가 보상 (옵션)
    // ========================================
    const bonusRewards = this._draw.createElement('div', 'bonus-rewards');

    const bonusTitle = this._draw.createElement('div', 'bonus-title');
    this._draw.setText(bonusTitle, '✨ 보너스 보상');

    const bonusGrid = this._draw.createElement('div', 'bonus-grid');

    // 보너스 아이템들
    const bonusGold = this.#createBonusItem('💰', '+10 골드');
    const bonusHeal = this.#createBonusItem('❤️', '+5 HP');
    const bonusRelic = this.#createBonusItem('💎', '행운의 부적');

    this._draw.appendChild(bonusGrid, bonusGold);
    this._draw.appendChild(bonusGrid, bonusHeal);
    this._draw.appendChild(bonusGrid, bonusRelic);

    this._draw.appendChild(bonusRewards, bonusTitle);
    this._draw.appendChild(bonusRewards, bonusGrid);

    // ========================================
    // 하단 액션 버튼
    // ========================================
    const rewardActions = this._draw.createElement('div', 'reward-actions');

    const skipBtn = this._draw.createElement('button', 'reward-action-btn secondary');
    this._draw.setText(skipBtn, '스킵');
    this._draw.setId(skipBtn, 'skipRewardBtn');

    const continueBtn = this._draw.createElement('button', 'reward-action-btn primary');
    this._draw.setText(continueBtn, '➡️ 다음으로');
    this._draw.setId(continueBtn, 'continueBtn');

    this._draw.appendChild(rewardActions, skipBtn);
    this._draw.appendChild(rewardActions, continueBtn);

    // ========================================
    // 조립
    // ========================================
    this._draw.appendChild(container, header);
    this._draw.appendChild(container, rewardStats);
    this._draw.appendChild(container, rewardContent);
    this._draw.appendChild(container, bonusRewards);
    this._draw.appendChild(container, rewardActions);

    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug('Reward screen created');
  }

  /**
   * 보상 카드 생성 (데모용)
   * @param {number} index 카드 인덱스
   * @returns {HTMLElement}
   */
  #createRewardCard(index) {
    const types = ['card', 'item', 'relic'];
    const type = types[index % types.length];

    const card = this._draw.createElement('div', 'reward-card');
    this._draw.addClass(card, type);

    const cardGlow = this._draw.createElement('div', 'reward-card-glow');

    const cardIcon = this._draw.createElement('div', 'reward-card-icon');
    const icons = ['🃏', '💎', '🏆'];
    this._draw.setText(cardIcon, icons[index]);

    const cardName = this._draw.createElement('div', 'reward-card-name');
    this._draw.setText(cardName, `보상 ${index + 1}`);

    const cardDesc = this._draw.createElement('div', 'reward-card-description');
    this._draw.setText(cardDesc, '승리 보상');

    const selectBtn = this._draw.createElement('button', 'reward-select-btn');
    this._draw.setText(selectBtn, '선택');

    this._draw.appendChild(card, cardGlow);
    this._draw.appendChild(card, cardIcon);
    this._draw.appendChild(card, cardName);
    this._draw.appendChild(card, cardDesc);
    this._draw.appendChild(card, selectBtn);

    return card;
  }

  /**
   * 보너스 아이템 생성
   * @param {string} icon 아이콘
   * @param {string} text 텍스트
   * @returns {HTMLElement}
   */
  #createBonusItem(icon, text) {
    const item = this._draw.createElement('div', 'bonus-item');

    const itemIcon = this._draw.createElement('div', 'bonus-icon');
    this._draw.setText(itemIcon, icon);

    const itemText = this._draw.createElement('div', 'bonus-text');
    this._draw.setText(itemText, text);

    this._draw.appendChild(item, itemIcon);
    this._draw.appendChild(item, itemText);

    return item;
  }
}
