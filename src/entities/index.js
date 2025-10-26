// 파일위치: /src/entities/index.js
// 파일명: index.js
// 용도: entities 폴더의 모든 스크립트 파일 로드 관리
// 기능: entities 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: entities 관련 모듈 로드 및 전역 네임스페이스 관리

const entityScripts = [
  // 로드 경로 : /src/entities/*.js
  '/src/entities/Player.js',
  '/src/entities/Enemy.js',
  '/src/entities/Card.js',
  '/src/entities/Deck.js',
];

loadScripts(entityScripts);
