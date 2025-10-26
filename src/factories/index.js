// 파일위치: /src/factories/index.js
// 파일명: index.js
// 용도: factories 폴더의 모든 스크립트 파일 로드 관리
// 기능: factories 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: factories 관련 모듈 로드 및 전역 네임스페이스 관리

const factoryScripts = [
  // 로드 경로 : /src/factories/*.js
  '/src/factories/PlayerFactory.js',
  '/src/factories/EnemyFactory.js',
  '/src/factories/CardFactory.js',
  '/src/factories/DeckFactory.js',
];

loadScripts(factoryScripts);
