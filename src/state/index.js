// 파일위치: /src/state/index.js
// 파일명: index.js
// 용도: state 폴더의 모든 스크립트 파일 로드 관리
// 기능: state 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: state 관련 모듈 로드 및 전역 네임스페이스 관리

const stateScripts = [
  // 로드 경로 : /src/state/*.js
  '/src/state/MapState.js',
  '/src/state/GameState.js',
  '/src/state/DebugState.js',
];

loadScripts(stateScripts);
