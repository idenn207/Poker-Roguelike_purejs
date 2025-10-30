/**
 * 파일위치: /src/managers/InputManager.js
 * 파일명: InputManager.js
 * 용도: 사용자 입력 처리
 * 기능: 버튼 클릭, 키보드 입력 등 처리
 * 책임: 입력을 받아서 StateManager에 액션 요청
 */

class InputManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    console.debug('InputManager initialized');
  }

  /**
   * 이벤트 리스너 등록
   */
  init() {
    console.debug('InputManager init complete');
  }

  /**
   * 입력 이벤트 등록
   */
  registerEvents() {
    // 버튼 클릭 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.INPUT.BUTTON.CLICKED, this.onButtonClicked.bind(this));

    console.debug('InputManager events registered');
  }

  /**
   * 버튼 클릭 이벤트 핸들러
   * @param {Object} data
   * @param {string} data.button 버튼 타입
   */
  onButtonClicked(data) {
    const { button } = data;

    switch (button) {
      case 'new-game':
        this.handleNewGameFromMenu();
        break;

      case 'settings':
        this.handleSettings();
        break;

      case 'prev-character':
        this.handlePrevCharacter();
        break;

      case 'next-character':
        this.handleNextCharacter();
        break;

      case 'back-to-menu':
        this.handleBackToMenu();
        break;

      case 'start-game':
        this.handleStartGame();
        break;

      default:
        console.warn('Unknown button:', button);
        break;
    }
  }

  /**
   * 새 게임 버튼 핸들러
   */
  handleNewGameFromMenu() {
    console.log('New game button clicked');

    // StateManager에 새 게임 시작 액션 요청
    this.eventBus.emit(EVENTS.ACTION.GAME.NEW_GAME_FROM_MENU, {});
  }

  /**
   * 설정 버튼 핸들러
   */
  handleSettings() {
    console.log('Settings button clicked');

    // StateManager에 화면 전환 액션 요청
    this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
      screenName: SCREEN_STATE_TYPE.SETTINGS,
    });
  }

  /**
   * 이전 캐릭터 버튼 핸들러
   */
  handlePrevCharacter() {
    console.log('Previous character button clicked');

    // StateManager에 캐릭터 변경 액션 요청
    this.eventBus.emit(EVENTS.ACTION.CHARACTER.CHANGE, {
      direction: 'prev',
    });
  }

  /** 다음 캐릭터 버튼 핸들러 */
  handleNextCharacter() {
    console.log('Next character button clicked');

    // StateManager에 캐릭터 변경 액션 요청
    this.eventBus.emit(EVENTS.ACTION.CHARACTER.CHANGE, {
      direction: 'next',
    });
  }

  /**
   * 메뉴로 돌아가기 버튼 핸들러
   */
  handleBackToMenu() {
    console.log('Back to menu button clicked');

    // StateManager에 화면 전환 액션 요청
    this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, {
      screenName: SCREEN_STATE_TYPE.MENU,
    });
  }

  /**
   * 게임 시작 버튼 핸들러 (캐릭터 선택 화면)
   */
  handleStartGame() {
    console.log('Start game button clicked');
    // 1단계: 현재 캐릭터 확정
    this.eventBus.emit(EVENTS.ACTION.CHARACTER.CONFIRM, {});

    // 2단계: 게임 플레이 시작 (상점으로 이동)
    this.eventBus.emit(EVENTS.ACTION.GAME.BEGIN_GAMEPLAY, {});
  }

  update() {
    // 입력 상태 업데이트
  }
}
