/**
 * 파일위치: /src/state/UIState.js
 * 파일명: UIState.js
 * 용도: UI 상태 데이터 관리
 * 기능: 툴팁 상태, UI 요소 표시 상태 저장
 * 책임: UI 관련 상태 데이터 저장 (로직 없음)
 */

class UIState {
  constructor() {
    /** 툴팁 상태 */
    this.tooltip = {
      isVisible: false,
      targetElement: null,
      title: "",
      description: "",
      position: { top: 0, left: 0 },
    };

    console.debug("UIState Initialized");
  }
}
