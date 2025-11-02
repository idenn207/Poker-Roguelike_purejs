/**
 * 파일위치: /src/managers/StateManager.js
 * 파일명: StateManager.js
 * 용도: 게임 상태 관리
 * 기능: 화면 상태, 게임 진행 상태 관리
 * 책임: 전역 상태 데이터 관리 및 상태 변경 이벤트 처리
 */

class StateManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    /** @type {GameState} 전역 게임 상태 */
    this.gameState = new GameState();

    /** @type {DebugState} 전역 맵 상태 */
    this.mapState = new DebugState();

    /** @type {UIState} */
    this.uiState = new UIState();

    /** @type {RenderState} */
    this.renderState = new RenderState();

    /** @type {DebugState} 전역 디버그 상태 */
    this.debugState = new DebugState();

    console.debug("StateManager initialized");
  }

  // ========================================
  // 초기화
  // ========================================

  /** 게임 상태 초기화 */
  init() {
    // 초기 화면을 logo로 설정
    this.gameState.currentScreen = SCREEN_STATE_TYPE.LOGO;
    this.gameState.previousScreen = null;

    console.debug("StateManager init complete - Initial screen: logo");
  }

  /** 게임 상태 이벤트 등록 */
  registerEvents() {
    // 액션 요청 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.SCREEN.CHANGE, this.handleChangeScreen.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.CHARACTER.CHANGE, this.handleChangeCharacter.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.CHARACTER.SELECT, this.handleSelectCharacter.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.CHARACTER.CONFIRM, this.handleConfirmCharacter.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.GAME.NEW_GAME_FROM_MENU, this.handlerStartNewGameFromMenu.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.GAME.BEGIN_GAMEPLAY, this.handleBeginGameplay.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.SHOP.PURCHASE, this.handleShopPurchase.bind(this));

    // Debug 액션 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.DEBUG.TOGGLE, this.handleToggleDebug.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.DEBUG.CHANGE_TAB, this.handleChangeDebugTab.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.UPDATE_LOOP_INFO, this.handleUpdateLoopInfo.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.DEBUG.COLLAPSE_TOGGLE, this.handleToggleDebugCollapse.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.DEBUG.EVENT_LOGGED, this.handleEventLogged.bind(this));

    // 에러 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.ERROR.OCCURRED, this.handleErrorOccurred.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.DEBUG.CLEAR_ERRORS, this.handleClearErrors.bind(this));

    // 상태 조회 요청 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.GAME.STATE, this.handleQueryGameState.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.CHARACTER.STATE, this.handleQueryCharacterState.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.DEBUG.STATE, this.handleQueryDebugState.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.PLAYER.INFO, this.handleQueryPlayerInfo.bind(this));

    // 상태 조회 응답 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.RESPONSE.RENDER.TOOLTIP.POSITION, this.handleTooltipPositionResponse.bind(this));

    // 툴팁 액션 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.RENDER.TOOLTIP.SHOW, this.handleShowTooltip.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.RENDER.TOOLTIP.HIDE, this.handleHideTooltip.bind(this));

    console.log("StateManager events registered");
  }

  // ========================================
  // 화면 상태 관리
  // ========================================

  /**
   * 화면 전환 액션 핸들러
   * @param {Object} data
   * @param {typeof SCREEN_STATE_TYPE[keyof typeof SCREEN_STATE_TYPE]} data.screenName
   */
  handleChangeScreen(data) {
    const { screenName } = data;

    // 상태 업데이트
    this.gameState.previousScreen = this.gameState.currentScreen;
    this.gameState.currentScreen = screenName;

    console.debug(`Screen state changed: ${this.gameState.previousScreen} -> ${this.gameState.currentScreen}`);

    // 화면 전환 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.SCREEN.CHANGED, {
      previous: this.gameState.previousScreen,
      current: this.gameState.currentScreen,
    });

    // 캐릭터 선택 화면으로 전환 시 초기 캐릭터 정보 전송
    if (screenName === SCREEN_STATE_TYPE.CHARACTER_SELECT) {
      this.#emitCharacterState();
    }
  }

  // ========================================
  // 캐릭터 상태 관리
  // ========================================

  /**
   * 캐릭터 변경 액션 핸들러
   * @param {Object} data
   * @param {'prev'|'next'} data.direction
   */
  handleChangeCharacter(data) {
    const { direction } = data;
    const totalChars = this.gameState.availableCharacters.length;

    let index = this.gameState.currentCharacterIndex;

    if (direction === "prev") {
      index = (index - 1 + totalChars) % totalChars;
    } else if (direction === "next") {
      index = (index + 1) % totalChars;
    }
    this.gameState.currentCharacterIndex = index;

    console.debug("Character changed:", this.gameState.currentCharacterIndex);

    // 캐릭터 변경 이벤트 발행
    this.#emitCharacterState();
  }

  /**
   * 캐릭터 선택 액션 핸들러
   * @param {Object} data
   */
  handleSelectCharacter(data) {
    const currentCharacter = this.gameState.getCurrentCharacter();
    this.gameState.selectedCharacter = currentCharacter;

    // 플레이어 데이터에 캐릭터 정보 설정
    this.gameState.player = { ...currentCharacter }; // 기본 스텟 override
    this.gameState.player.character = currentCharacter;
    this.gameState.player.deck = new DeckFactory(currentCharacter.deck);
    this.gameState.player.items = []; // TODO: ItemFactory 개발 필요
    this.gameState.player.relics = []; // TODO: RelicFactory 개발 필요

    console.debug("Character selected:", currentCharacter.name);

    // 캐릭터 선택 완료 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.CHARACTER.SELECTED, {
      character: currentCharacter,
      player: { ...this.gameState.player },
    });
  }

  /**
   * 캐릭터 최종 확정 핸들러 (게임 시작 버튼 클릭 시)
   * @param {Object} data
   */
  handleConfirmCharacter(data) {
    const currentCharacter = this.gameState.getCurrentCharacter();

    if (!currentCharacter) {
      console.error("No character selected");
      return;
    }

    this.gameState.selectedCharacter = currentCharacter;

    // 플레이어 데이터 초기화
    this.gameState.player = { ...currentCharacter }; // 기본 스텟 override
    this.gameState.player.character = currentCharacter;
    this.gameState.player.deck = new DeckFactory(currentCharacter.deck);
    this.gameState.player.items = []; // TODO: ItemFactory 개발 필요
    this.gameState.player.relics = []; // TODO: RelicFactory 개발 필요

    console.debug("Character confirmed:", currentCharacter.name);

    // 캐릭터 선택 완료 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.CHARACTER.CONFIRMED, {
      character: currentCharacter,
      player: { ...this.gameState.player },
    });
  }

  /**
   * 게임 플레이 시작 핸들러
   * @param {Object} data
   */
  handleBeginGameplay(data) {
    // 게임 활성화
    this.gameState.isGameActive = true;
    this.gameState.isNewGame = false;

    console.log("Gameplay started");

    // 게임 플레이 시작 완료 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.GAME.GAMEPLAY_BEGAN, {
      isGameActive: this.gameState.isGameActive,
      player: { ...this.gameState.player },
    });

    // 첫 번째 노드(상점)로 화면 전환
    this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
      screenName: SCREEN_STATE_TYPE.SHOP,
    });
  }

  /**
   * 상점 구매 처리
   * @param {Object} data
   * @param {string} data.type
   * @param {number} data.price
   * @param {Object} data.itemData
   */
  handleShopPurchase(data) {
    const { type, price, itemData } = data;

    // 골드 체크
    if (this.gameState.player.gold < price) {
      console.warn("Not enough gold");
      this.eventBus.emit(EVENTS.SHOP.PURCHASE_FAILED, { reason: "insufficient_gold" });
      return;
    }

    // 골드 차감
    this.gameState.player.gold -= price;

    // 상품 지급
    switch (type) {
      case "card":
        // TODO: 카드 추가 로직
        console.log(`Card purchased: ${itemData.title}`);
        break;
      case "item":
        // TODO: 아이템 추가 로직
        console.log(`Item purchased: ${itemData.title}`);
        break;
      case "upgrade":
        // TODO: 업그레이드 적용 로직
        console.log(`Upgrade purchased: ${itemData.title}`);
        break;
    }

    // 구매 완료 이벤트
    this.eventBus.emit(EVENTS.SHOP.ITEM_PURCHASED, { type, itemData });

    // 플레이어 정보 업데이트 (UI에 반영)
    this.eventBus.emit(EVENTS.STATE.SHOP.PLAYER_INFO_UPDATED, {
      hp: this.gameState.player.hp,
      maxHp: this.gameState.player.maxHp,
      gold: this.gameState.player.gold,
    });
  }

  /**
   * 새 게임 시작 액션 핸들러
   * @param {Object} data
   */
  handlerStartNewGameFromMenu(data) {
    // 게임 상태 초기화
    this.gameState.isNewGame = true;
    this.gameState.isGameActive = false;
    this.gameState.stage.current = 1;
    this.gameState.stage.maxReached = 1;

    // 캐릭터 선택 초기화
    this.gameState.currentCharacterIndex = 0;
    this.gameState.selectedCharacter = null;

    console.log("New game started");

    // 캐릭터 선택 화면으로 전환
    this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
      screenName: SCREEN_STATE_TYPE.CHARACTER_SELECT,
    });
  }

  // ========================================
  // 상태 조회 핸들러
  // ========================================

  /**
   * 게임 상태 조회 요청 핸들러
   * @param {Object} data
   * @param {string} data.requestId
   */
  handleQueryGameState(data) {
    const { requestId } = data;

    this.eventBus.emit(EVENTS.RESPONSE.GAME.STATE, {
      requestId,
      currentScreen: this.gameState.currentScreen,
      previousScreen: this.gameState.previousScreen,
      isGameActive: this.gameState.isGameActive,
      isNewGame: this.gameState.isNewGame,
      stage: { ...this.gameState.stage },
      player: { ...this.gameState.player },
    });
  }

  /**
   * 캐릭터 상태 조회 요청 핸들러
   * @param {Object} data
   */
  handleQueryCharacterState(data) {
    const { requestId } = data;

    // 응답 이벤트 발행
    this.#emitCharacterState(requestId);
  }

  /**
   * Debug 상태 조회 요청 핸들러
   * @param {Object} data
   * @param {string} data.requestId 요청 ID
   */
  handleQueryDebugState(data) {
    const { requestId } = data;

    // 응답 이벤트 발행
    this.eventBus.emit(EVENTS.RESPONSE.DEBUG.STATE, {
      requestId,
      isActive: this.debugState.isActive,
      currentTab: this.debugState.currentTab,
      loopInfo: this.debugState.loopInfo,
      fpsHistory: this.debugState.fpsHistory,
      recentEvents: this.debugState.recentEvents,
      errors: [...this.debugState.errors],
    });
  }

  /**
   * 플레이어 정보 조회 처리
   * @param {Object} data
   * @param {string} data.requestId
   */
  handleQueryPlayerInfo(data) {
    const { requestId } = data;

    // 플레이어 정보 전송
    this.eventBus.emit(EVENTS.STATE.SHOP.PLAYER_INFO_UPDATED, {
      requestId: requestId,
      hp: this.gameState.player.hp,
      maxHp: this.gameState.player.maxHp,
      gold: this.gameState.player.gold,
    });
  }

  // ========================================
  // Debug 상태 관리
  // ========================================

  /**
   * Debug 패널 토글 액션 핸들러
   * @param {Object} data
   */
  handleToggleDebug(data) {
    this.debugState.isActive = !this.debugState.isActive;

    console.debug("Debug panel toggled:", this.debugState.isActive);

    // Debug 상태 변경 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.DEBUG.TOGGLED, {
      isActive: this.debugState.isActive,
      currentTab: this.debugState.currentTab,
    });
  }

  /**
   * Debug 탭 변경 액션 핸들러
   * @param {Object} data
   * @param {string} data.tabId
   */
  handleChangeDebugTab(data) {
    const { tabId } = data;
    this.debugState.currentTab = tabId;

    console.debug("Debug tab changed:", this.debugState.currentTab);

    // Debug 탭 변경 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.DEBUG.TAB.CHANGED, {
      currentTab: this.debugState.currentTab,
      isActive: this.debugState.isActive,
    });
  }

  /**
   * 게임 루프 정보 업데이트 액션 핸들러
   * @param {Object} data
   * @param {number} data.fps 초당 프레임 수
   * @param {number} data.deltaTime 델타 타임
   * @param {number} data.totalTime 총 플레이 시간
   * @param {number} data.frameCount 프레임 수
   * @param {number} data.avgFps 평균 프레임 수
   * @param {boolean} data.running 게임 루프 실행 중 여부
   * @param {boolean} data.paused 게임 루프 일시 정지 여부
   */
  handleUpdateLoopInfo(data) {
    // 루프 정보 업데이트
    this.debugState.loopInfo = {
      fps: data.fps || 0,
      deltaTime: data.deltaTime || 0,
      totalTime: data.totalTime || 0,
      frameCount: data.frameCount || 0,
      avgFps: data.avgFps || 0,
      running: data.running || false,
      paused: data.paused || false,
    };

    // FPS 히스토리 업데이트
    if (data.fps > 0) {
      this.debugState.fpsHistory.unshift(data.fps);
      if (this.debugState.fpsHistory.length > this.debugState.maxFpsHistory) {
        this.debugState.fpsHistory.pop();
      }
    }

    // Debug가 활성화되어 있으면 이벤트 발행
    if (this.debugState.isActive) {
      this.eventBus.emit(EVENTS.STATE.DEBUG.LOOP_UPDATED, {
        loopInfo: this.debugState.loopInfo,
        fpsHistory: this.debugState.fpsHistory,
      });
    }
  }

  /**
   * Debug 패널 접기/펼치기 액션 핸들러
   * @param {Object} data
   */
  handleToggleDebugCollapse(data) {
    this.debugState.isCollapsed = !this.debugState.isCollapsed;

    console.debug("Debug panel collapsed:", this.debugState.isCollapsed);

    // Debug 접기 상태 변경 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.DEBUG.COLLAPSED, {
      isCollapsed: this.debugState.isCollapsed,
    });
  }

  /**
   * 이벤트 로그 핸들러
   * @param {Object} log
   */
  handleEventLogged(log) {
    // 최근 이벤트에 추가
    this.debugState.recentEvents.unshift(log);

    // 최대 개수 유지
    if (this.debugState.recentEvents.length > this.debugState.maxRecentEvents) {
      this.debugState.recentEvents.pop();
    }

    // Debug가 활성화되어 있으면 이벤트 발행
    if (this.debugState.isActive) {
      this.eventBus.emit(EVENTS.STATE.DEBUG.EVENT_ADDED, {
        event: log,
        recentEvents: this.debugState.recentEvents,
      });
    }
  }

  // ========================================
  // 에러 처리
  // ========================================

  /**
   * 에러 발생 핸들러
   * @param {*} errorData 에러 정보
   */
  handleErrorOccurred(errorData) {
    this.debugState.errors.unshift(errorData);

    // 최대 개수 초과 시 오래된 것 제거
    if (this.debugState.errors.length > this.debugState.maxErrors) {
      this.debugState.errors.pop();
    }

    console.debug("Error logged to DebugState:", errorData.message);

    // 에러 추가 이벤트 발행 (UI 업데이트용)
    this.eventBus.emit(EVENTS.STATE.DEBUG.ERROR_ADDED, {
      errorCount: this.debugState.errors.length,
      latestError: errorData,
    });
  }

  /**
   * 에러 클리어 핸들러
   * @param {Object} data
   */
  handleClearErrors(data) {
    this.debugState.errors = [];
    console.debug("All errors cleared");

    // 에러 클리어 완료 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.DEBUG.ERRORS_CLEARED, {
      timestamp: Date.now(),
    });
  }

  // ========================================
  // 툴팁
  // ========================================

  /**
   * 툴팁 표시 처리
   * @param {Object} data
   * @param {HTMLElement} data.target
   * @param {string} data.title
   * @param {string} data.description
   */
  handleShowTooltip(data) {
    const { target, title, description } = data;

    // 1. UIState 업데이트
    this.uiState.tooltip.isVisible = true;
    this.uiState.tooltip.targetElement = target;
    this.uiState.tooltip.title = title;
    this.uiState.tooltip.description = description;

    // 2. RenderManager에게 위치 계산 요청
    this.eventBus.emit(EVENTS.QUERY.RENDER.TOOLTIP.POSITION, {
      target: target,
      requestId: "tooltip-show",
    });
  }

  /**
   * 툴팁 위치 계산 응답 처리
   * @param {Object} data
   * @param {number} data.top
   * @param {number} data.left
   * @param {string} data.position
   */
  handleTooltipPositionResponse(data) {
    const { top, left, position } = data;

    // UIState 위치 업데이트
    this.uiState.tooltip.position = { top, left };

    // RenderManager에게 렌더링 요청
    this.eventBus.emit(EVENTS.STATE.RENDER.TOOLTIP_UPDATED, {
      tooltipState: this.uiState.tooltip,
      position: position,
    });
  }

  /**
   * 툴팁 숨김 처리
   */
  handleHideTooltip() {
    // UIState 업데이트
    this.uiState.tooltip.isVisible = false;
    this.uiState.tooltip.targetElement = null;

    // RenderManager에게 렌더링 요청
    this.eventBus.emit(EVENTS.STATE.RENDER.TOOLTIP_UPDATED, {
      tooltipState: this.uiState.tooltip,
    });
  }

  // ========================================
  // 핼퍼 메서드
  // ========================================

  #emitCharacterState(requestId = null) {
    const currentCharacter = this.gameState.getCurrentCharacter();
    const characters = this.gameState.availableCharacters;
    const index = this.gameState.currentCharacterIndex;

    // 이전/다음 캐릭터 계산
    const totalChars = characters.length;
    const prevIndex = (index - 1 + totalChars) % totalChars;
    const nextIndex = (index + 1) % totalChars;

    const eventData = {
      requestId,
      currentCharacter,
      currentIndex: index,
      prevCharacter: characters[prevIndex],
      prevIndex,
      nextCharacter: characters[nextIndex],
      nextIndex,
      allCharacters: characters,
      selectedCharacter: this.gameState.selectedCharacter,
    };

    // 이벤트 발행
    if (requestId) {
      this.eventBus.emit(EVENTS.RESPONSE.CHARACTER.STATE, eventData);
    } else {
      this.eventBus.emit(EVENTS.STATE.CHARACTER.CHANGED, eventData);
    }
  }

  // ========================================
  // 업데이트
  // ========================================

  update(deltaTime) {
    // 상태 업데이트 로직
  }
}
