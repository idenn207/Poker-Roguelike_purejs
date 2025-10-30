// 파일위치: /src/core/index.js
// 파일명: index.js
// 용도: core 폴더의 모든 스크립트 파일 로드 관리
// 기능: core 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: core 관련 모듈 로드 및 전역 네임스페이스 관리

const coreScripts = [
  // 로드 경로 : /src/core/*.js
  '/src/core/EventBus.js',
  '/src/core/ErrorHandler.js',
  '/src/core/DrawHelper.js',
  '/src/core/ManagerCore.js',
  '/src/core/UICore.js',
];

loadScripts(coreScripts);
