'use strict';
// @ts-check

/**
 * 파일 위치: /src/index.js
 * 파일명: index.js
 * 용도: 애플리케이션 진입점 및 스크립트 로더
 * 기능:
 *   - 계층적 스크립트 로딩 (메인 → 서브 스크립트)
 *   - 각 index.js의 하위 스크립트 로드 완료 후 다음 진행
 *   - 전역 큐를 통한 순차적 로딩 보장
 * 책임:
 *   - mainScripts 순서 보장 (SRP)
 *   - 중첩 loadScripts 호출 관리
 *   - 로드 완료 콜백 처리
 */

const mainScripts = [
  // 1. 개발용 유틸
  'src/global.js',

  // 2. 설정값
  'src/config/index.js',

  // 3. 유틸리티
  'src/utils/index.js',

  // 4. 상태관리 (최하위 의존성)
  'src/state/index.js',

  // 5. 데이터 모델 (최하위 의존성)
  'src/data/index.js',

  // 6. 핵심 엔진
  'src/core/index.js',

  // 7. 컴포넌트 (factory가 사용)
  'src/components/index.js',

  // 8. 엔티티 (factory가 생성, data에 의존)
  'src/entities/index.js',

  // 9. 팩토리 (components + entities + data 사용)
  'src/factories/index.js',

  // 10. 로직 (순수 계산 함수들)
  'src/logic/index.js',

  // 11. 매니저 (state + logic + factories 사용) (GameManager.js :  managers 조율)
  'src/managers/index.js',

  // 12. 렌더링
  'src/render/index.js',

  // 13. UI
  'src/ui/index.js',

  // 14. 에셋 (비동기 로드 가능)
  'src/assets/index.js',

  // 15. 게임 루프
  'src/GameLoop.js',

  // 16. 게임 초기화 (마지막)
  'src/main.js',
];

// 전역 스크립트 로딩 상태
const scriptQueue = [];
let isLoadingSubScripts = false;
let currentMainScriptIndex = 0;
let pendingSubScriptsCount = 0;

/**
 * 스크립트를 큐에 추가하고 순차적으로 로드
 * @param {string[]} scripts - 로드할 스크립트 경로 배열
 */
function loadScripts(scripts = []) {
  if (scripts === mainScripts) {
    // 메인 스크립트 로딩 시작
    loadNextMainScript();
  } else {
    // 서브 스크립트 로딩 (index.js 내부에서 호출)
    pendingSubScriptsCount += scripts.length;
    scripts.forEach((src) => scriptQueue.push(src));

    if (!isLoadingSubScripts) {
      processSubScriptQueue();
    }
  }
}

/**
 * 다음 메인 스크립트 로드
 */
function loadNextMainScript() {
  if (currentMainScriptIndex >= mainScripts.length) {
    onAllScriptsLoaded();
    return;
  }

  const src = mainScripts[currentMainScriptIndex++];
  const script = document.createElement('script');
  script.src = src;

  script.onload = () => {
    // 메인 스크립트 로드 완료, 서브 스크립트 대기
    if (pendingSubScriptsCount === 0) {
      // 서브 스크립트가 없으면 바로 다음으로
      loadNextMainScript();
    }
    // 서브 스크립트가 있으면 processSubScriptQueue에서 처리
  };

  script.onerror = () => {
    console.error('Failed to load script:', src);
    loadNextMainScript();
  };

  document.head.appendChild(script);
}

/**
 * 서브 스크립트 큐 처리
 */
function processSubScriptQueue() {
  if (scriptQueue.length === 0) {
    isLoadingSubScripts = false;

    // 모든 서브 스크립트 로드 완료, 다음 메인 스크립트로
    if (pendingSubScriptsCount === 0) {
      loadNextMainScript();
    }
    return;
  }

  isLoadingSubScripts = true;
  const src = scriptQueue.shift();
  const script = document.createElement('script');
  script.src = src;

  script.onload = () => {
    pendingSubScriptsCount--;
    processSubScriptQueue();
  };

  script.onerror = () => {
    console.error('Failed to load script:', src);
    pendingSubScriptsCount--;
    processSubScriptQueue();
  };

  document.head.appendChild(script);
}

/**
 * 모든 스크립트 로드 완료 후 초기화
 */
function onAllScriptsLoaded() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
  } else {
    main();
  }
}

// 메인 스크립트 로딩 시작
loadScripts(mainScripts);
