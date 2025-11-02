/**
 * 파일위치: /src/state/RenderState.js
 * 파일명: RenderState.js
 * 용도: 렌더링 상태 데이터 관리
 * 기능: 렌더링 관련 상태 저장
 * 책임: 렌더링 상태 데이터 저장 (로직 없음)
 */

class RenderState {
  constructor() {
    /** 렌더링 대기 큐 */
    this.renderQueue = [];

    /** 활성 애니메이션 목록 */
    this.activeAnimations = [];

    console.debug("RenderState Initialized");
  }
}
