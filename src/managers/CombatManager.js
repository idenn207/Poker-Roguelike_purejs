/**
 * CombatManager
  - 전투 시작/종료 관리
  - 턴 순서 조율
  - UI 업데이트 지시
 */
class CombatManager extends ManagerCore {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
    this.currentTurn = 0;
  }

  /** 전투 시스템 초기화 */
  init() {}

  /** 전투 시스템 이벤트 등록 */
  registerEvents() {}

  update(deltaTime) {
    // 턴 업데이트 로직
  }
}
