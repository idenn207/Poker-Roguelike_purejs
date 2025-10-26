'use strict';
// @ts-check

/**
 * 파일 위치: js/utils/console-override.js
 * 파일명: console-override.js
 * 용도: Console 메서드 override
 * 기능: console의 모든 주요 메서드에 호출자 정보(클래스명, 함수명, 파일 경로) 추가
 * 책임:
 *   - 원본 console 메서드 보존
 *   - 호출 스택 분석 및 호출자 정보 추출
 *   - 상대 경로 변환
 *   - 로그에 호출자 정보 prefix 추가
 */

(function () {
  // 원본 console 메서드들 저장
  const originalConsole = {
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
    trace: console.trace,
  };

  // 기준 경로 설정
  const basePath = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);

  /**
   * 호출자 정보 추출 함수
   * @returns {string} 호출자 정보 문자열
   */
  function getCallerInfo() {
    const stack = new Error().stack;
    const stackLines = stack.split('\n');

    // 호출자 정보 추출 (3번째 라인)
    // [0]: Error
    // [1]: getCallerInfo
    // [2]: overrideConsole (wrapper 함수)
    // [3]: 실제 호출자
    const callerLine = stackLines[3] || '';

    // 다양한 패턴 매칭
    // 예: "at ClassName.methodName (file.js:10:5)"
    // 예: "at functionName (file.js:10:5)"
    // 예: "at new ClassName (file.js:10:5)"
    const classMethodMatch = callerLine.match(/at ([^.]+)\.([^\s]+)\s+\(([^]+):(\d+):\d+\)/);
    const functionMatch = callerLine.match(/at ([^\s]+)\s+\(([^]+):(\d+):\d+\)/);
    const constructorMatch = callerLine.match(/at new ([^\s]+)\s+\(([^]+):(\d+):\d+\)/);
    const anonymousMatch = callerLine.match(/at\s+([^]+):(\d+):\d+/);

    let location = 'unknown';
    if (classMethodMatch) {
      // 클래스 메서드 호출
      const className = classMethodMatch[1];
      const methodName = classMethodMatch[2];
      const filePath = convertToRelativePath(classMethodMatch[3]);
      const lineNumber = classMethodMatch[4];
      location = `${className}.${methodName} (${filePath}:${lineNumber})`;
    } else if (constructorMatch) {
      // 생성자 호출
      const className = constructorMatch[1];
      const filePath = convertToRelativePath(constructorMatch[2]);
      const lineNumber = constructorMatch[3];
      location = `new ${className} (${filePath}:${lineNumber})`;
    } else if (functionMatch) {
      // 일반 함수 호출
      const functionName = functionMatch[1];
      const filePath = convertToRelativePath(functionMatch[2]);
      const lineNumber = functionMatch[3];
      location = `${functionName} (${filePath}:${lineNumber})`;
    } else if (anonymousMatch) {
      // 익명 함수
      const filePath = convertToRelativePath(anonymousMatch[1]);
      const lineNumber = anonymousMatch[2];
      location = `anonymous (${filePath}:${lineNumber})`;
    }

    return location;
  }

  /**
   * 절대 경로를 상대 경로로 변환
   * @param {string} fullPath - 전체 경로
   * @returns {string} 상대 경로
   */
  function convertToRelativePath(fullPath) {
    if (fullPath.startsWith(basePath)) {
      return fullPath.replace(basePath, '');
    } else if (fullPath.startsWith('http')) {
      try {
        const url = new URL(fullPath);
        return url.pathname.substring(1); // 맨 앞 '/' 제거
      } catch (e) {
        return fullPath;
      }
    }
    return fullPath;
  }

  /**
   * Console 메서드 override 함수
   * @param {string} methodName - console 메서드 이름
   * @param {Function} originalMethod - 원본 console 메서드
   * @returns {Function} override된 함수
   */
  function overrideConsole(methodName, originalMethod) {
    return function (...args) {
      const callerInfo = getCallerInfo();
      const prefix = `[${callerInfo}]`;
      originalMethod.apply(console, [prefix, ...args]);
    };
  }

  // 모든 console 메서드 override
  console.log = overrideConsole('log', originalConsole.log);
  console.info = overrideConsole('info', originalConsole.info);
  console.warn = overrideConsole('warn', originalConsole.warn);
  console.error = overrideConsole('error', originalConsole.error);
  console.debug = overrideConsole('debug', originalConsole.debug);

  // trace는 이미 스택 정보를 출력하므로 prefix만 추가
  console.trace = function (...args) {
    const callerInfo = getCallerInfo();
    const prefix = `[${callerInfo}]`;
    originalConsole.trace.apply(console, [prefix, ...args]);
  };

  // 원본 console 복원 함수 (디버깅용)
  console.restoreOriginal = function () {
    console.log = originalConsole.log;
    console.info = originalConsole.info;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.debug = originalConsole.debug;
    console.trace = originalConsole.trace;
  };
})();
