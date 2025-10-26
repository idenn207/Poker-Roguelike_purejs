class EventBus {
  constructor() {
    /**
     * 이벤트 리스너 저장소
     * @type {Map<string, Array<{id: string, callback: Function, once: boolean}>>}
     */
    this.events = new Map();

    /**
     * 리스너 ID 생성용 카운터
     * @type {number}
     */
    this.listenerIdCounter = 0;

    /**
     * 이벤트 히스토리 (디버그용)
     * @type {Array<{event: string, data: any, timestamp: number}>}
     */
    this.eventHistory = [];

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

    console.debug('EventBus Initialized');
  }

  /**
   * 이벤트 구독
   * @param {string} eventName 이벤트명
   * @param {Function} callback 콜백 함수
   * @returns {string} 리스너 ID (제거할 때 사용)
   */
  on(eventName, callback, once = false) {
    if (typeof eventName !== 'string') {
      console.error('Event name must be a string');
      return null;
    }

    if (typeof callback !== 'function') {
      console.error('Callback must be a function');
      return null;
    }

    // 이벤트 없으면 생성
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    // 리스너 ID 생성
    const listenerId = `listener_${++this.listenerIdCounter}`;

    // 리스너 등록
    const listener = {
      id: listenerId,
      callback,
      once,
    };

    this.events.get(eventName).push(listener);

    console.debug(`Listener registered for "${eventName}" (ID: ${listenerId})`);

    // 제거 함수 반환
    return listenerId;
  }

  once(eventName, callback) {
    return this.on(eventName, callback, true);
  }

  /**
   * 이벤트 구독 해제
   * @param {string} eventName 이벤트명
   * @param {string} listenerId 리스너 ID
   * @returns {boolean} 제거 성공 여부
   */
  off(eventName, listenerId) {
    if (!this.events.has(eventName)) {
      console.warn(`No listeners registered for "${eventName}"`);
      return false;
    }

    const listeners = this.events.get(eventName);
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
      this.events.delete(eventName);
    }

    return true;
  }

  /**
   * 이벤트 발행
   * @param {string} eventName 이벤트명
   * @param {Object} data 데이터
   */
  emit(eventName, data = null) {
    console.debug(`Emitting event: ${eventName}`, data);
    // 이벤트 리스너가 없으면 반환
    if (!this.events.has(eventName)) {
      console.warn(`No listeners registered for "${eventName}"`);
      return;
    }

    // 히스토리에 추가
    this.eventHistory.push({
      event: eventName,
      data,
      timestamp: performance.now(),
    });

    // 최대 길이 유지
    if (this.eventHistory.length > this.maxHistoryLength) {
      this.eventHistory.shift();
    }

    this.isDispatching = true;

    // 이벤트 발행
    for (const listener of this.events.get(eventName)) {
      console.debug('listener: ', listener);
      listener.callback(data);

      if (listener.once) {
        this.off(eventName, listener.id);
      }
    }

    this.isDispatching = false;
  }

  /**
   * 임시 디버깅용
   * @static
   */
  static debug() {
    console.debug('Debug Info:');
    console.debug('Registered Events:');

    this.events.forEach((listeners, eventName) => {
      console.debug(`  - ${eventName}: ${listeners.length} listener(s)`);
      listeners.forEach((listener, index) => {
        console.debug(`    [${index + 1}] ID: ${listener.id}, Once: ${listener.once}`);
      });
    });

    console.debug(`\nEvent History (last ${this.eventHistory.length}):`);
    this.eventHistory.slice(-5).forEach((record) => {
      console.debug(`  - ${record.event}:`, record.data);
    });
  }
}
