/**
 * 파일위치: /src/managers/DebugManager.js
 * 파일명: DebugManager.js
 * 용도: 디버그 패널 관리
 * 기능: EventBus 추적, GameState 표시, FPS 모니터링
 * 책임: 개발자 도구 제공
 */

class DebugManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    console.debug("DebugManager Initialized");
  }

  init() {
    // F1 키 리스너 등록
    this.trackDomListener(window, EVENTS.DOM.KEYDOWN, (e) => {
      if (e.key === "F1") {
        e.preventDefault();
        this.toggleDebugPanel();
      }
    });

    console.debug("DebugManager init complete");
  }

  /** Debug 이벤트 등록 */
  registerEvents() {
    console.debug("DebugManager events registered");
  }

  /**
   * Debug 패널 토글
   */
  toggleDebugPanel() {
    console.debug("F1 pressed - Toggle debug panel");

    // StateManager에 Debug 토글 액션 요청
    this.eventBus.emit(EVENTS.ACTION.DEBUG.TOGGLE, {});
  }

  /**
   * Debug 명령 실행
   * @param {string} command
   */
  executeCommand(command) {
    console.debug("Debug command:", command);

    switch (command) {
      case "clear-events":
        this.cleanupEventListeners();
        console.log("✅ Event log cleared");
        break;

      case "show-registered":
        this.showRegisteredEvents();
        break;

      case "toggle-logging":
        const currentState = this.eventBus.loggingEnabled;
        this.eventBus.setLogging(!currentState);
        console.log(`✅ Event logging ${!currentState ? "enabled" : "disabled"}`);
        break;

      default:
        console.warn("Unknown debug command:", command);
        break;
    }
  }

  /**
   * 등록된 이벤트 표시
   */
  showRegisteredEvents() {
    const events = this.eventBus.getRegisteredEvents();
    console.group("📋 Registered Events");
    events.forEach((event) => {
      console.log(`${event.eventName} (${event.listenerCount} listeners)`);
    });
    console.groupEnd();
  }

  update(deltaTime) {
    // Debug 업데이트 로직
  }
}
