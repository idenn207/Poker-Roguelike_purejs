/**
 * 파일위치: /src/managers/GameManager.js
 * 파일명: GameManager.js
 * 용도: 게임 진행 관리
 * 기능: 모든 Manager 통합 관리
 * 책임: 게임 로직 및 Manager 조율
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
    // UI 먼저 생성 (화면 요소들이 DOM에 추가)
    this.managers.ui.init(); // UI 매니저 초기화

    // DOM 요소 연결
    this.managers.screen.init(); // 화면 매니저 초기화

    // 초기 화면 상태 설정
    this.managers.state.init(); // 게임 상태 매니저 초기화

    // 나머지 매니저 초기화
    this.managers.input.init(); // 사용자 입력 매니저 초기화
    this.managers.card.init(); // 전투 매니저 초기화
    this.managers.deck.init(); // 덱 매니저 초기화
    this.managers.stage.init(); // 스테이지 매니저 초기화
    this.managers.combat.init(); // 전투 매니저 초기화
    this.managers.shop.init(); // 상점 매니저 초기화
    this.managers.reward.init(); // 보상 매니저 초기화
    this.managers.render.init(); // 렌더링 매니저 초기화

    // 이벤트 등록
    this.registerAllEventListeners();

    console.debug('GameManager init complete');
  }

  /**
   * 모든 Manager의 이벤트 리스너 등록
   */
  registerAllEventListeners() {
    console.debug('registered events for all managers');

    Object.entries(this.managers).forEach(([name, manager]) => {
      if (manager.registerEvents && typeof manager.registerEvents === 'function') {
        console.debug(`registering events for ${name}...`);
        manager.registerEvents();
      }
    });

    console.debug('all events registered');
  }

  /**
   * 게임 상태 업데이트
   */
  update(deltaTime) {
    const currentScreen = GameState.currentScreen;

    switch (currentScreen) {
      case SCREEN_STATE_TYPE.BATTLE: {
        // 게임 업데이트 로직
        this.managers.combat.update(deltaTime);
        break;
      }
      case SCREEN_STATE_TYPE.MENU: {
        // 메뉴 업데이트 로직
        break;
      }
      default: {
        // 기타 화면
        break;
      }
    }

    // UI 업데이트
    this.managers.ui.update(deltaTime);

    // 렌더링 업데이트
    this.managers.render.update(deltaTime);
  }

  /**
   * 새 게임 시작
   */
  newGame() {
    console.log('New game starting...');
    // TODO: 구현 예정
  }

  /**
   * 스테이지 선택
   */
  selectStage(stage) {
    console.log(`Stage selected: ${stage}`);
    // TODO: 구현 예정
  }

  /**
   * 전투 종료
   */
  endCombat() {
    console.log('Combat ended');
    // 구현 예정
  }
}
