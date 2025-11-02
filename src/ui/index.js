// 파일위치: /src/ui/index.js
// 파일명: index.js
// 용도: ui 폴더의 모든 스크립트 파일 로드 관리
// 기능: ui 폴더 내 JS 파일들을 전역 객체에 등록
// 책임: ui 관련 모듈 로드 및 전역 네임스페이스 관리

const uiScripts = [
  // 로드 경로 : /src/ui/*.js
  //'/src/ui/components/.js',

  // hud
  "/src/ui/hud/HealthBar.js",
  "/src/ui/hud/Stage.js",
  "/src/ui/hud/Tooltip.js",

  // menus
  "/src/ui/menus/MainMenu.js",
  "/src/ui/menus/PauseMenu.js",
  "/src/ui/menus/GameOverMenu.js",

  // screen
  "/src/ui/screen/ShopScreen.js",
  "/src/ui/screen/BattleScreen.js",
  "/src/ui/screen/RewardScreen.js",

  // panels
  "/src/ui/panels/DebugPanel.js",
];

loadScripts(uiScripts);
