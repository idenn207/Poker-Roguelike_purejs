class EventBus {
  constructor() {
    /**
     * 이벤트 리스너 저장소
     * @type {Map<string, Array<{id: string, callback: Function, once: boolean}>>}
     */
    this.listeners = new Map();

    /**
     * 리스너 ID 생성용 카운터
     * @type {number}
     */
    this.listenerIdCounter = 0;

    /**
     * 이벤트 히스토리 (디버그용)
     * @type {Array<{timestamp: number, time: Date, eventName: string, data: any, listenerCount: number}>}
     */
    this.eventLog = [];

    /**
     * 최대 히스토리 길이
     * @type {number}
     */
    this.maxHistoryLength = 100;

    /**
     * 이벤트 발행 중 여부
     * @type {boolean}
     */
    this.isDispatching = false;

    /**
     * @type {boolean} 로깅 활성화 여부
     */
    this.loggingEnabled = true;

    /** 이벤트 무시 목록 */
    this.ignoreLoggingEvents = [
      // 루프 방지
      EVENTS.DEBUG.EVENT_LOGGED,
      EVENTS.STATE.DEBUG.LOOP_UPDATED,
      EVENTS.STATE.DEBUG.EVENT_ADDED,

      // 리소스 너무 많음
      EVENTS.ACTION.UPDATE_LOOP_INFO,
      EVENTS.QUERY.GAME.STATE,
      EVENTS.RESPONSE.GAME.STATE,
      EVENTS.QUERY.DEBUG.STATE,
      EVENTS.RESPONSE.DEBUG.STATE,

      // 디버그 패널 관련
      EVENTS.ACTION.DEBUG.TOGGLE,
      EVENTS.ACTION.DEBUG.CHANGE_TAB,
      EVENTS.ACTION.DEBUG.COLLAPSE_TOGGLE,
      EVENTS.STATE.DEBUG.TAB.CHANGED,
      EVENTS.STATE.DEBUG.TOGGLED,
      EVENTS.STATE.DEBUG.COLLAPSED,
      EVENTS.RENDER.DEBUG_PANEL,

      // 기타
      /** 이벤트 추가... */
    ];

    console.debug('EventBus Initialized');
  }

  /**
   * 이벤트 구독
   * @param {string} eventName 이벤트명
   * @param {Function} handler 콜백 함수
   * @returns {string} 리스너 ID (제거할 때 사용)
   */
  on(eventName, handler, once = false) {
    if (typeof eventName !== 'string') {
      console.error('Event name must be a string');
      return null;
    }

    if (typeof handler !== 'function') {
      console.error('Callback must be a function');
      return null;
    }

    // 이벤트 없으면 생성
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }

    // 리스너 ID 생성
    const listenerId = `listener_${++this.listenerIdCounter}`;

    // 리스너 등록
    const listener = {
      id: listenerId,
      callback: handler,
      once,
    };

    this.listeners.get(eventName).push(listener);

    console.debug(`Listener registered for "${eventName}" (ID: ${listenerId})`);

    // 제거 함수 반환
    return listenerId;
  }

  /**
   * 일회용 이벤트 구독
   * @param {string} eventName
   * @param {Function} handler
   * @returns {string} 리스너 ID (제거할 때 사용)
   */
  once(eventName, handler) {
    return this.on(eventName, handler, true);
  }

  /**
   * 이벤트 구독 해제
   * @param {string} eventName 이벤트명
   * @param {string} listenerId 리스너 ID
   * @returns {boolean} 제거 성공 여부
   */
  off(eventName, listenerId) {
    if (!this.listeners.has(eventName)) {
      console.warn(`No listeners registered for "${eventName}"`);
      return false;
    }

    const listeners = this.listeners.get(eventName);
    const index = listeners.findIndex((listener) => listener.id === listenerId);

    // 이벤트 리스너가 없으면
    if (index === -1) {
      console.warn(`Listener ID "${listenerId}" not found for "${eventName}"`);
      return false;
    } else {
      listeners.splice(index, 1);
      console.debug(`Listener unregistered for "${eventName}" (ID: ${listenerId})`);
    }

    // 리스너가 없으면 이벤트 제거
    if (listeners.length === 0) {
      this.listeners.delete(eventName);
    }

    return true;
  }

  /**
   * 이벤트 발행
   * @param {string} eventName 이벤트명
   * @param {Object} data 데이터
   */
  emit(eventName, data = null) {
    // 로그 기록
    if (this.loggingEnabled) {
      if (!this.ignoreLoggingEvents.includes(eventName)) {
        this.logEvent(eventName, data);
      }
    }

    this.isDispatching = true;

    // 이벤트 리스너가 없으면 반환
    if (!this.listeners.has(eventName)) {
      console.warn(`No listeners registered for "${eventName}"`);
      return;
    }

    // 이벤트 발행
    for (const listener of this.listeners.get(eventName)) {
      // console.debug('listener: ', listener);
      listener.callback(data);

      if (listener.once) {
        this.off(eventName, listener.id);
      }
    }

    this.isDispatching = false;
  }

  /**
   * 이벤트 로그 기록
   * @param {string} eventName 디버그 이벤트명
   * @param {any} data
   */
  logEvent(eventName, data) {
    const logEntry = {
      timestamp: Date.now(),
      time: new Date().toLocaleTimeString('ko-KR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        fractionalSecondDigits: 3,
      }),
      eventName,
      data: this.cloneData(data),
      listenerCount: this.listeners.get(eventName)?.size || 0,
    };

    this.eventLog.unshift(logEntry);

    // 최대 로그 크기 유지
    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.pop();
    }

    // 디버그 이벤트 발행 (DebugManager가 구독)
    this.emit(EVENTS.DEBUG.EVENT_LOGGED, logEntry);
  }

  /**
   * 데이터 복사 (순환 참조 방지)
   * @param {any} data
   * @returns {any}
   */
  cloneData(data) {
    try {
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      return { error: 'Cannot clone data (circular reference)' };
    }
  }

  /**
   * 이벤트 로그 조회
   * @returns {typeof this.eventLog}
   */
  getEventLog() {
    return [...this.eventLog];
  }

  /**
   * 이벤트 로그 초기화
   */
  clearEventLog() {
    this.eventLog = [];
    console.debug('Event log cleared');
  }

  /**
   * 등록된 이벤트 목록 조회
   * @returns {Array<Object>}
   */
  getRegisteredEvents() {
    const events = [];
    this.listeners.forEach((listeners, eventName) => {
      events.push({
        eventName,
        listenerCount: listeners.size,
      });
    });
    return events.sort((a, b) => a.eventName.localeCompare(b.eventName));
  }

  /**
   * 로깅 활성화/비활성화
   * @param {boolean} enabled
   */
  setLogging(enabled) {
    this.loggingEnabled = enabled;
    console.debug(`Event logging ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * 모든 리스너 제거
   */
  clear() {
    this.listeners.clear();
    console.debug('All event listeners cleared');
  }
}
