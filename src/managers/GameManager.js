// @ts-check

/**
 * 파일위치: /src/managers/game-manager.js
 * 파일명: game-manager.js
 * 용도: 게임 진행 관리
 * 기능: Deck과 Hand 통합 관리
 * 책임: 게임 로직 및 카드 이동 조정
 */

class GameManager extends ManagerCore {
  constructor() {
    super();
    /** @type {EventBus} */
    this.eventBus = new EventBus();
    this.managers = {
      state: new StateManager(this.eventBus),
      input: new InputManager(this.eventBus),
      card: new CardManager(this.eventBus),
      deck: new DeckManager(this.eventBus),
      stage: new StageManager(this.eventBus),
      combat: new CombatManager(this.eventBus),
      shop: new ShopManager(this.eventBus),
      reward: new RewardManager(this.eventBus),
      render: new RenderManager(this.eventBus),
      ui: new UIManager(this.eventBus),
      screen: new ScreenManager(this.eventBus),
    };

    console.debug('GameManager Initialized');
  }

  /**
   * 게임 초기화
   */
  init() {
    // 각 매니저 초기화
    this.managers.state.init(); // 게임 상태 매니저 초기화
    this.managers.input.init(); // 사용자 입력 매니저 초기화
    this.managers.combat.init(); // 전투 매니저 초기화
    this.managers.screen.init(); // 화면 매니저 초기화

    // 이벤트 등록
    this.registerAllEventListeners();
  }

  registerAllEventListeners() {
    console.log('이벤트 리스너 등록 중...');

    Object.entries(this.managers).forEach(([name, manager]) => {
      if (manager.registerEvents && typeof manager.registerEvents === 'function') {
        console.log(`${name} 이벤트 등록...`);
        manager.registerEvents();
      }
    });

    console.log('모든 이벤트 리스너 등록 완료');
  }

  /**
   * 게임 상태 업데이트
   */
  update(deltaTime) {
    const currentScreen = GameState.currentScreen;

    switch (currentScreen) {
      case SCREEN_STATE_TYPE.BATTLE:
        // 게임 업데이트 로직
        CombatManager.update(deltaTime);
        break;
      case SCREEN_STATE_TYPE.MENU:
        // 메뉴 업데이트 로직
        break;
    }

    // 상태 업데이트 로직
    // UI 업데이트 로직
    // UIManager.update();

    // Debug 화면 업데이트 로직
  }

  newGame() {}

  selectStage(stage) {
    // this.stage = stage;
    return this;
  }

  endCombat() {}
}
