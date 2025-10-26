// 파일위치: /src/render/index.js
// 파일명: index.js
// 용도: render 폴더의 모든 스크립트 파일 로드 관리
// 기능: render 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: render 관련 모듈 로드 및 전역 네임스페이스 관리

const renderScripts = [
  // 로드 경로 : /src/render/*.js
  '/src/render/DebugRenderer.js',
];

loadScripts(renderScripts);
