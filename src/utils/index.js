// 파일위치: /src/utils/index.js
// 파일명: index.js
// 용도: utils 폴더의 모든 스크립트 파일 로드 관리
// 기능: utils 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: utils 관련 모듈 로드 및 전역 네임스페이스 관리

const utilsScripts = [
  // 로드 경로 : /src/utils/*.js
  '/src/utils/console-override.js',
  '/src/utils/string.js',
  '/src/utils/random.js',
  '/src/utils/mixin.js',
  '/src/utils/mixin/index.js',
];

loadScripts(utilsScripts);
