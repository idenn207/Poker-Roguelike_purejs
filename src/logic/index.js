// 파일위치: /src/logic/index.js
// 파일명: index.js
// 용도: logic 폴더의 모든 스크립트 파일 로드 관리
// 기능: logic 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: logic 관련 모듈 로드 및 전역 네임스페이스 관리

const logicScripts = [
  // 로드 경로 : /src/logic/*.js
];

loadScripts(logicScripts);
