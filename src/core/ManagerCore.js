class ManagerCore extends EventCleanup {
  constructor() {
    super();

    this._draw = DrawHelper;
  }

  destroy() {
    this.cleanupEventListeners();
  }
}
// 다중 믹스인을 적용하기 위한 헬퍼 함수
// applyMixins(ManagerCore, EventCleanup);
