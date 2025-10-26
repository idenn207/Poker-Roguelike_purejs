class StageManager extends ManagerCore {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
  }

  /** 스테이지 초기화 */
  init() {}

  /** 스테이지 이벤트 등록 */
  registerEvents() {}

  update(deltaTime) {}
}
