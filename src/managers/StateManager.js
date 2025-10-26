class StateManager extends ManagerCore {
  constructor(eventBus) {
    super();

    this.eventBus = eventBus;

    this.gameState = new GameState();
  }

  /** 게임 상태 초기화 */
  init() {}

  /** 게임 상태 이벤트 등록 */
  registerEvents() {}

  update(deltaTime) {}
}
