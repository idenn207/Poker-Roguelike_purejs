// 파일위치: /src/data/index.js
// 파일명: index.js
// 용도: data 폴더의 모든 스크립트 파일 로드 관리
// 기능: data 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: data 관련 모듈 로드 및 전역 네임스페이스 관리

const dataScripts = [
  // 로드 경로 : /src/data/*.js
  '/src/data/cards.js',
  '/src/data/decks.js',
  '/src/data/character.js',
  '/src/data/enemies.js',
];

loadScripts(dataScripts);
