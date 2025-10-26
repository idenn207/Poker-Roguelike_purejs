// 파일위치: /src/managers/index.js
// 파일명: index.js
// 용도: managers 폴더의 모든 스크립트 파일 로드 관리
// 기능: managers 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: managers 관련 모듈 로드 및 전역 네임스페이스 관리

const managerScripts = [
  // 로드 경로 : /src/managers/*.js
  '/src/managers/StateManager.js',
  '/src/managers/InputManager.js',
  '/src/managers/CardManager.js',
  '/src/managers/DeckManager.js',
  '/src/managers/StageManager.js',
  '/src/managers/CombatManager.js',
  '/src/managers/ShopManager.js',
  '/src/managers/RewardManager.js',
  '/src/managers/RenderManager.js',
  '/src/managers/UIManager.js',
  '/src/managers/ScreenManager.js',
  '/src/managers/DebugManager.js',
  '/src/managers/GameManager.js',
];

loadScripts(managerScripts);
