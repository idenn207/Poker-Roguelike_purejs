/**
 * 파일 위치: /src/utils/EventCleanupMixin.js
 * 파일명: EventCleanupMixin.js
 * 용도: 이벤트 리스너 자동 정리 기능 제공
 * 기능:
 *   - 이벤트 리스너 등록 추적
 *   - 자동 cleanup 메서드 생성
 *   - 메모리 누수 방지
 * 책임:
 *   - 단일 책임: 이벤트 리스너 생명주기 관리
 *   - 믹스인 패턴: 모든 클래스에 적용 가능
 */

/**
 * @typedef {Object} EventListenerRecord
 * @property {string} type - 이벤트 타입
 * @property {EventTarget|EventBus} target - 이벤트 대상
 * @property {Function} handler - 핸들러 함수
 * @property {string} [listenerId] - EventBus ID
 */

/**
 * 이벤트 정리 믹스인
 */

class EventCleanup {
  constructor() {
    /**
     * 등록된 이벤트 리스너 목록
     * @type {EventListenerRecord[]}
     */
    this._eventListeners = [];

    /**
     * Cleanup 실행 여부
     * @type {boolean}
     */
    this._iscleanedUp = false;

    // console.debug('EventCleanupMixin Initialized');
  }

  /**
   * EventBus 이벤트 등록 (추적)
   * @param {EventBus} eventBus
   * @param {string} eventName
   * @param {Function} handler
   * @returns {string} 리스너 ID
   */
  trackEventBusListener(eventBus, eventName, handler) {
    const listenerId = eventBus.on(eventName, handler);
    this._eventListeners.push({
      type: eventName,
      target: eventBus,
      handler: handler,
      listenerId: listenerId,
    });
    return listenerId;
  }

  /**
   * DOM 이벤트 등록 (추적)
   * @param {HTMLElement|EventBus} target
   * @param {string} eventName 이벤트명
   * @param {Function} handler
   * @param {HTMLElement} options
   * @returns {string} 리스너 ID
   */
  trackDomListener(target, eventType, handler, options) {
    target.addEventListener(eventType, handler, options);
    this._eventListeners.push({
      type: eventType,
      target: target,
      handler: handler,
    });

    console.debug(`DOM listener tracked: ${eventType}`, { target: target.constructor.name }, this.constructor.name);
  }

  /**
   * 모든 이벤트 리스너 제거
   */
  cleanupEventListeners() {
    if (this._iscleanedUp) {
      console.debug('cleanupEventListeners already called');
      return;
    }

    if (!this._eventListeners.length) {
      console.debug('No event listeners to clean up');
      return;
    }

    this._eventListeners.forEach(({ type, target, handler, listenerId }) => {
      if (target instanceof EventBus) {
        target.off(type, listenerId);
      } else {
        target.removeEventListener(type, handler);
      }
    });

    this._eventListeners = [];
    this._iscleanedUp = true;

    console.debug('All event listeners cleaned up');
  }

  /**
   * 특정 이벤트 타입에 대한 리스너 정리
   * @param {string} eventType 이벤트명
   */
  cleanupListenersByType(eventType) {
    this._eventListeners = this._eventListeners.filter(({ type, target, handler, listenerId }) => {
      if (type === eventType) {
        if (target instanceof EventBus) {
          target.off(type, listenerId);
        } else {
          target.removeEventListener(type, handler);
        }
        return false;
      }
      return true;
    });

    console.debug(`Event listeners cleaned up for type: ${eventType}`, this.constructor.name);
  }
}
