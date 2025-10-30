/**
 * 파일위치: /src/core/ErrorHandler.js
 * 파일명: ErrorHandler.js
 * 용도: 전역 에러 처리 및 추적
 * 기능: 모든 에러를 캐치하고 이벤트 트레이스와 함께 로깅
 * 책임: 에러 수집, 분석, 디버깅 정보 제공
 */

class ErrorHandler {
  constructor(eventBus) {
    /** @type {EventBus} */
    this.eventBus = eventBus;

    /** @type {Array<Object>} 에러 히스토리 */
    this.errorHistory = [];

    /** @type {number} 최대 에러 저장 개수 */
    this.maxErrorHistory = 50;

    /** @type {{ERROR: string, UNHANDLED_REJECTION: string, MANUAL_ERROR: string}} 에러 타입 */
    this._ERROR_TYPE = {
      ERROR: 'ERROR', // 동기 에러
      UNHANDLED_REJECTION: 'UNHANDLED_REJECTION', // 비동기 Promise 에러
      MANUAL_ERROR: 'MANUAL_ERROR', // 수동 에러
    };

    console.debug('ErrorHandler Initialized');
  }

  /** 전역 에러 핸들러 설정 */
  setupGlobalHandlers() {
    // 동기 에러 캐치
    window.addEventListener('error', (event) => {
      this.handleError({
        type: this._ERROR_TYPE.ERROR,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // 비동기 Promise 에러 캐치
    window.addEventListener('unhandledrejection', (evnet) => {
      this.handleError({
        type: this._ERROR_TYPE.UNHANDLED_REJECTION,
        message: event.reason?.message || 'Unhanded Promise Rejection',
        reason: event.reason,
      });
    });

    console.debug('Global error handlers registered');
  }

  /**
   * 에러 처리 메인 로직
   * @param {Object} errorData 에러 정보
   */
  handleError(errorData) {
    const timestamp = Date.now();
    const errorEntry = {
      ...errorData,
      timestamp,
      time: this.formatTime(timestamp),
      recentEvents: this.getRecentEvents(10),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // 에러 히스토리에 추가
    this.errorHistory.push(errorEntry);

    // 최대 개수 초과 시 오래된 것 제거
    if (this.errorHistory.length > this.maxErrorHistory) {
      this.errorHistory.shift();
    }

    // 에러 이벤트 발행
    if (this.eventBus) {
      this.eventBus.emit(EVENTS.ERROR.OCCURRED, errorEntry);
    }

    // 콘솔에 상세 로그 출력
    this.logError(errorEntry);
  }

  /**
   * EventBus에서 최근 이벤트 가져오기
   * @param {*} count 가져올 이벤트 개수
   * @returns {Array<{time: Date, event: string, data: any}>} 최근 이벤트 목록
   */
  getRecentEvents(count = 10) {
    if (!this.eventBus) {
      return [];
    }

    const history = this.eventBus.getEventLog();
    if (history.length <= 0) {
      return [];
    }

    return history.slice(-count).map((entry) => ({
      time: entry.time,
      event: entry.eventName,
      data: entry.data,
    }));
  }

  /**
   * 타임스탬프를 시간 분자열로 변환
   * @param {*} timestamp
   * @returns {String} HH:MM:SS.mmm 형식
   */
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${hours}:${minutes}:${seconds}.${ms}`;
  }

  /**
   * 에러를 콘솔에 로깅
   * @param {*} errorEntry
   */
  logError(errorEntry) {
    console.group(`🔥 ${errorEntry.type} at ${errorEntry.time}`);
    console.error('Message:', errorEntry.message);

    if (errorEntry.filename) {
      console.error('File:', `${errorEntry.filename}:${errorEntry.lineno}:${errorEntry.colno}`);
    }

    if (errorEntry.error && errorEntry.error.stack) {
      console.error('Stack:', errorEntry.error.stack);
    }

    if (errorEntry.recentEvents && errorEntry.recentEvents.length > 0) {
      console.group('Recent Events (Last 10):');
      errorEntry.recentEvents.forEach((evt, idx) => {
        console.log(`${idx + 1}. [${evt.time}] ${evt.event}`, evt.data);
      });
      console.groupEnd();
    }

    console.groupEnd();
  }

  /**
   * 에러 히스토리 조회
   * @returns {Array<Object>} 모든 에러 목록
   */
  getErrorHistory() {
    return [...this.errorHistory];
  }

  /**
   * 에러 히스토리 초기화
   */
  clearErrorHistory() {
    this.errorHistory = [];
    console.debug('Error history cleared');
  }

  /**
   * 수동으로 에러 기록
   * @param {string} message 에러 메시지
   * @param {Object} context 추가 컨텍스트
   */
  logManualError(message, context = {}) {
    this.handleError({
      type: this._ERROR_TYPE.MANUAL_ERROR,
      message,
      context,
    });
  }
}
