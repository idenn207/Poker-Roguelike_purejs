/**
 * 파일위치: /src/state/MapState.js
 * 파일명: MapState.js
 * 용도: 맵 진행 상태 관리
 * 기능: 스테이지, 노드, 진행 상태 데이터 저장
 * 책임: 맵 관련 순수 데이터 저장 (로직 없음)
 *
 * 📌 이 클래스는 GameState.map 속성으로 통합됩니다.
 */

/** 맵 진행 상태 클래스 */
class MapState {
  constructor() {
    // ========================================
    // 메인/서브 스테이지
    // ========================================

    /** @type {number} 현재 메인 스테이지 (1-3) */
    this.currentFloor = 1;

    /** @type {number} 현재 서브 스테이지 (1-5) */
    this.currentRoom = 1;

    /** @type {number} 도달한 최대 메인 스테이지 */
    this.maxFloorReached = 1;

    // ========================================
    // 진행 상태 추적
    // ========================================

    /**
     * 현재 서브스테이지 진행 상태
     * @type {Object}
     */
    this.progress = {
      /** 상점 방문 완료 */
      shopVisited: false,

      /** 휴식 방문 완료 */
      restVisited: false,

      /** 몬스터 처치 완료 */
      monsterDefeated: false,

      /** 보물 획득 완료 (확률적) */
      treasureCollected: false,

      /** 이벤트 완료 (확률적) */
      eventCompleted: false,
    };

    // ========================================
    // 현재 노드 정보
    // ========================================

    /**
     * 현재 선택 가능한 노드 목록
     * @type {Array<{id: string, type: string, state: string, data: Object}>}
     */
    this.availableNodes = [];

    /**
     * 현재 진행 중인 노드
     * @type {Object|null}
     */
    this.currentNode = null;

    // ========================================
    // 히스토리
    // ========================================

    /**
     * 방문한 노드 히스토리
     * @type {Array<{floor: number, room: number, nodeType: string, timestamp: number}>}
     */
    this.visitHistory = [];

    // ========================================
    // 보상 대기 상태
    // ========================================

    /** @type {boolean} 보상 선택 대기 중 */
    this.awaitingReward = false;

    /** @type {Object|null} 대기 중인 보상 데이터 */
    this.pendingReward = null;
  }

  // ========================================
  // 접근자 메서드 (Getter)
  // ========================================

  /**
   * 현재 위치를 "플로어-룸" 형식으로 반환
   * @returns {string} 예: "1-2"
   */
  getCurrentLocation() {
    return `${this.currentFloor}-${this.currentRoom}`;
  }

  /**
   * 현재 서브스테이지가 보스 스테이지인지 확인
   * @returns {boolean}
   */
  isBossRoom() {
    return this.currentRoom === 5;
  }

  /**
   * 현재 서브스테이지의 진행률 계산 (0-100%)
   * @returns {number}
   */
  getRoomProgress() {
    const completed = [this.progress.shopVisited, this.progress.restVisited, this.progress.monsterDefeated].filter((v) => v).length;

    // 보스 룸은 3단계만 (상점, 휴식, 보스)
    const total = 3;

    return Math.floor((completed / total) * 100);
  }

  /**
   * 다음 필수 노드 타입 반환 (상점 → 휴식 → 몬스터 순서)
   * @returns {string|null} 노드 타입 또는 null (모두 완료 시)
   */
  getNextRequiredNodeType() {
    // 보스 룸인 경우
    if (this.isBossRoom()) {
      if (!this.progress.shopVisited) return MAP_NODE_TYPE.SHOP;
      if (!this.progress.restVisited) return MAP_NODE_TYPE.REST;
      if (!this.progress.monsterDefeated) return MAP_NODE_TYPE.BOSS;
      return null; // 모두 완료
    }

    // 일반 룸
    if (!this.progress.shopVisited) return MAP_NODE_TYPE.SHOP;
    if (!this.progress.restVisited) return MAP_NODE_TYPE.REST;
    if (!this.progress.monsterDefeated) return MAP_NODE_TYPE.MONSTER;

    return null; // 모두 완료
  }

  /**
   * 선택적 노드(보물/이벤트)가 출현 가능한지 확인
   * @returns {boolean}
   */
  canOptionalNodesAppear() {
    // 상점과 휴식을 모두 방문한 후에만 출현
    return this.progress.shopVisited && this.progress.restVisited;
  }

  /**
   * 현재 서브스테이지가 완료되었는지 확인
   * @returns {boolean}
   */
  isRoomCompleted() {
    return this.progress.shopVisited && this.progress.restVisited && this.progress.monsterDefeated;
  }

  /**
   * 현재 메인스테이지가 완료되었는지 확인
   * @returns {boolean}
   */
  isFloorCompleted() {
    return this.currentRoom === 5 && this.isRoomCompleted();
  }

  // ========================================
  // 상태 변경 메서드 (Setter)
  // ========================================

  /**
   * 서브스테이지 진행 상태 초기화
   */
  resetRoomProgress() {
    this.progress = {
      shopVisited: false,
      restVisited: false,
      monsterDefeated: false,
      treasureCollected: false,
      eventCompleted: false,
    };
  }

  /**
   * 방문 히스토리에 기록 추가
   * @param {string} nodeType 노드 타입
   */
  addVisitHistory(nodeType) {
    this.visitHistory.push({
      floor: this.currentFloor,
      room: this.currentRoom,
      nodeType,
      timestamp: Date.now(),
    });
  }

  /**
   * 다음 서브스테이지로 이동
   * @returns {boolean} 이동 성공 여부
   */
  advanceToNextRoom() {
    if (!this.isRoomCompleted()) {
      console.warn('Cannot advance: room not completed');
      return false;
    }

    if (this.currentRoom < 5) {
      this.currentRoom++;
      this.resetRoomProgress();
      return true;
    }

    console.warn('Cannot advance: already at room 5');
    return false;
  }

  /**
   * 다음 메인스테이지로 이동
   * @returns {boolean} 이동 성공 여부
   */
  advanceToNextFloor() {
    if (!this.isFloorCompleted()) {
      console.warn('Cannot advance: floor not completed');
      return false;
    }

    if (this.currentFloor < 3) {
      this.currentFloor++;
      this.currentRoom = 1;
      this.maxFloorReached = Math.max(this.maxFloorReached, this.currentFloor);
      this.resetRoomProgress();
      return true;
    }

    console.warn('Cannot advance: already at floor 3');
    return false;
  }
}
