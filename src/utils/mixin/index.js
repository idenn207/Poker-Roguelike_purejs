// 파일위치: /src/mixin/index.js
// 파일명: index.js
// 용도: mixin 폴더의 모든 스크립트 파일 로드 관리
// 기능: mixin 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: mixin 관련 모듈 로드 및 전역 네임스페이스 관리

const mixinScripts = [
  // 로드 경로 : /src/utils/mixin/*.js
  '/src/utils/mixin/EventCleanup.js',
];

loadScripts(mixinScripts);
