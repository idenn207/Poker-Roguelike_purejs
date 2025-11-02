class RenderCore extends EventCleanup {
  constructor() {
    super();

    this._draw = DrawHelper;
  }

  destroy() {
    this.cleanupEventListeners();
  }
}
