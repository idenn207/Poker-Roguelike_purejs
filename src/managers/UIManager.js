class UIManager extends ManagerCore {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
  }

  /** UI 초기화 */
  init() {}

  /** UI 이벤트 등록 */
  registerEvents() {}

  update(deltaTime) {}
}
