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

    console.debug('StateManager initialized');
  }

  // ========================================
  // 초기화
  // ========================================

  /** 게임 상태 초기화 */
  init() {
    // 초기 화면을 logo로 설정
    this.gameState.currentScreen = SCREEN_STATE_TYPE.LOGO;
    this.gameState.previousScreen = null;

    console.debug('StateManager init complete - Initial screen: logo');
  }

  /** 게임 상태 이벤트 등록 */
  registerEvents() {
    // 액션 요청 이벤트 구독

    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.SCREEN.CHANGE, this.handleChangeScreen.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.CHARACTER.CHANGE, this.handleChangeCharacter.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.CHARACTER.SELECT, this.handleSelectCharacter.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.GAME.START, this.handlerStartNewGame.bind(this));

    // 상태 조회 요청 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.GAME.STATE, this.handleQueryGameState.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.CHARACTER.STATE, this.handleQueryCharacterState.bind(this));

    console.log('StateManager events registered');
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

    if (direction === 'prev') {
      index = (index - 1 + totalChars) % totalChars;
    } else if (direction === 'next') {
      index = (index + 1) % totalChars;
    }
    this.gameState.currentCharacterIndex = index;

    console.debug('Character changed:', this.gameState.currentCharacterIndex);

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
    this.gameState.player.character = currentCharacter;
    this.gameState.player.hp = currentCharacter.hp;
    this.gameState.player.maxHp = currentCharacter.maxHp;
    this.gameState.player.golds = currentCharacter.gold;
    this.gameState.player.items = []; // TODO: ItemFactory 개발 필요
    this.gameState.player.deck = new DeckFactory(currentCharacter.deck);
    this.gameState.player.relics = []; // TODO: RelicFactory 개발 필요

    console.debug('Character selected:', currentCharacter.name);

    // 캐릭터 선택 완료 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.CHARACTER.SELECTED, {
      character: currentCharacter,
      player: { ...this.gameState.player },
    });
  }

  /**
   * 새 게임 시작 액션 핸들러
   * @param {Object} data
   */
  handlerStartNewGame(data) {
    // 게임 상태 초기화
    this.gameState.isNewGame = true;
    this.gameState.isGameActive = false;
    this.gameState.stage.current = 1;
    this.gameState.stage.maxReached = 1;

    // 캐릭터 선택 초기화
    this.gameState.currentCharacterIndex = 0;
    this.gameState.selectedCharacter = null;

    console.log('New game started');

    // 새 게임 시작 이벤트 발행
    this.eventBus.emit(EVENTS.STATE.GAME.STARTED, {
      isNewGame: this.gameState.isNewGame,
      stage: { ...this.gameState.stage },
    });

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
