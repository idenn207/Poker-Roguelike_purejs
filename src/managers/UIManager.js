/**
 * 파일위치: /src/managers/UIManager.js
 * 파일명: UIManager.js
 * 용도: UI 요소 생성 및 관리
 * 기능: 화면별 UI 요소 동적 생성, 상태 기반 UI 업데이트
 * 책임: UI 렌더링 (상태는 StateManager에서 조회)
 */

class UIManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    /**
     * @typedef ScreenType
     * @property {ShopScreen} shop
     * @property {BattleScreen} battle
     * @property {RewardScreen} reward
     */
    /** @type {ScreenType} */
    this.screen = {
      shop: new ShopScreen(this.eventBus),
      battle: new BattleScreen(this.eventBus),
      reward: new RewardScreen(this.eventBus),
    };

    /**
     * @typedef HUDType
     * @property {Tooltip} tooltip
     */
    /** @type {HUDType} */
    this.hud = {
      tooltip: new Tooltip(),
    };

    console.debug("UIManager Initialized");
  }

  /** UI 초기화 */
  init() {
    // 각 화면 UI 생성
    this.createLogoScreen(); // 로고 화면
    this.createLoadingScreen(); // 로딩 화면
    this.createMenuScreen(); // 메뉴 화면
    this.createCharacterSelectScreen(); // 캐릭터 선택 화면
    this.screen.shop.createShopScreen(); // 상점 화면
    this.screen.battle.createBattleScreen(); // 전투 화면
    this.screen.reward.createRewardScreen(); // 보상 화면

    this.hud.tooltip.create(); // 툴팁

    this.createDebugPanel(); // 디버그 화면

    console.debug("UIManager init complete");
  }

  /** UI 이벤트 등록 */
  registerEvents() {
    // 화면 전환 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.SCREEN.CHANGED, this.onScreenChanged.bind(this));

    // 캐릭터 변경 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.CHARACTER.CHANGED, this.onCharacterChanged.bind(this));

    // Debug 상태 변경 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.TOGGLED, this.onDebugToggled.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.TAB.CHANGED, this.onDebugTabChanged.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.COLLAPSED, this.onDebugCollapsed.bind(this));

    console.debug("UIManager events registered");
  }

  /**
   * 화면 전환 이벤트 핸들러
   * @param {Object} data 이벤트 데이터
   * @param {string} data.screenName 전환된 화면 이름
   * @param {HTMLElement} data.element 전환된 화면 요소
   */
  onScreenChanged(data) {
    console.debug(`UI screen changed: ${data.screenName}`);
  }

  /**
   * 캐릭터 변경 이벤트 핸들러
   * @param {Object} data - StateManager 가 정달한 모든 캐릭터 정보
   * @param {string} data.requestId
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} data.currentCharacter
   * @param {number} data.currentIndex
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} data.prevCharacter
   * @param {number} data.prevIndex
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} data.nextCharacter
   * @param {number} data.nextIndex
   * @param {Array<typeof CHARACTERS[keyof typeof CHARACTERS]>} data.allCharacters
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} data.selectedCharacter
   */
  onCharacterChanged(data) {
    const { currentCharacter, currentIndex, prevCharacter, nextCharacter, allCharacters } = data;

    // 캐릭터 정보 업데이트
    this.updateCharacterInfo(currentCharacter);

    // 캐릭터 카드 업데이트
    this.updateCharacterCards(prevCharacter, currentCharacter, nextCharacter);
  }

  /**
   * 상점 플레이어 정보 업데이트
   * @param {Object} data
   * @param {number} data.hp
   * @param {number} data.maxHp
   * @param {number} data.gold
   */
  onShopPlayerInfoUpdated(data) {
    const { hp, maxHp, gold } = data;

    const hpEl = this._draw.getElementById("shopPlayerHp");
    const goldEl = this._draw.getElementById("shopPlayerGold");

    if (hpEl) this._draw.setText(hpEl, `${hp}/${maxHp}`);
    if (goldEl) this._draw.setText(goldEl, gold);
  }

  /**
   * 로고 화면 UI 생성
   */
  createLogoScreen() {
    const screen = this._draw.createElement("div", "screen");
    this._draw.setId(screen, "logoScreen");

    const container = this._draw.createElement("div", "logo-container");

    // 로고 이미지 (임시 텍스트)
    const logoImage = this._draw.createElement("div", "logo-image");
    this._draw.setText(logoImage, "🃏");

    // 로고 텍스트
    const logoText = this._draw.createElement("div", "logo-text");
    this._draw.setText(logoText, "Poker Roguelike");

    this._draw.appendChild(container, logoImage);
    this._draw.appendChild(container, logoText);
    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug("Logo screen created");
  }

  /**
   * 로딩 화면 UI 생성
   */
  createLoadingScreen() {
    const screen = this._draw.createElement("div", "screen");
    this._draw.setId(screen, "loadingScreen");

    const container = this._draw.createElement("div", "loading-container");

    // 스피너
    const spinner = this._draw.createElement("div", "spinner");

    // 로딩 텍스트
    const loadingText = this._draw.createElement("div", "loading-text");
    this._draw.setText(loadingText, "LOADING...");

    // TODO: 프로그래스 바 컨테이너 (나중에 사용)
    const progressContainer = this._draw.createElement("div", "progress-bar-container");
    const progressFill = this._draw.createElement("div", "progress-bar-fill");
    this._draw.appendChild(progressContainer, progressFill);

    this._draw.appendChild(container, spinner);
    this._draw.appendChild(container, loadingText);
    this._draw.appendChild(container, progressContainer);
    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug("Loading screen created");
  }

  /**
   * 메뉴 화면 UI 생성
   */
  createMenuScreen() {
    const screen = this._draw.createElement("div", "screen");
    this._draw.setId(screen, "menuScreen");

    // 정적 요소들
    this.addMenuDecorations(screen);

    // 메인 컨테이너
    const container = this._draw.createElement("div", "menu-container");

    // 타이틀
    const title = this._draw.createElement("div", "menu-title");
    this._draw.setText(title, "Poker Roguelike");

    // 버튼 컨테이너
    const buttonContainer = this._draw.createElement("div", "menu-buttons");

    // 새 게임 버튼
    const newGameBtn = this.createMenuButton("새 게임", "new-game-btn", false);
    this.trackDomListener(newGameBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "new-game" });
    });

    // 계속하기 버튼 (비활성화)
    const continueBtn = this.createMenuButton("계속하기", "continue-btn", true);

    // 설정 버튼
    const settingsBtn = this.createMenuButton("설정", "settings-btn", false, true);
    this.trackDomListener(settingsBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "settings" });
    });

    this._draw.appendChild(buttonContainer, newGameBtn);
    this._draw.appendChild(buttonContainer, continueBtn);
    this._draw.appendChild(buttonContainer, settingsBtn);

    // 푸터
    const footer = this._draw.createElement("div", "menu-footer");
    this._draw.setText(footer, "© 2025 Poker Roguelike");

    this._draw.appendChild(container, title);
    this._draw.appendChild(container, buttonContainer);
    this._draw.appendChild(container, footer);
    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug("Menu screen created");
  }

  /**
   * 캐릭터 선택 화면 UI 생성
   */
  createCharacterSelectScreen() {
    const screen = this._draw.createElement("div", "screen");
    this._draw.setId(screen, "characterSelectScreen");

    // 캐릭터 선택 타이틀
    const container = this._draw.createElement("div", "character-select-container");

    // TODO: 배경 이미지
    const background = this._draw.createElement("div", "character-background");
    this._draw.setId(background, "characterBackground");

    // 상단 정보 섹션
    const infoSection = this.createCharacterInfoSection();

    // 하단 선택 섹션
    const selectionSection = this.createCharacterSelectionSection();

    this._draw.appendChild(container, background);
    this._draw.appendChild(container, infoSection);
    this._draw.appendChild(container, selectionSection);
    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);

    console.debug("Character select screen created");
  }

  /**
   * 캐릭터 정보 섹션 생성
   * @returns {HTMLElement} 생성된 캐릭터 정보 섹션 요소
   */
  createCharacterInfoSection() {
    const section = this._draw.createElement("div", "character-info-section");

    const panel = this._draw.createElement("div", "character-info-panel");

    // 좌측 - 캐릭터 상세 정보
    const details = this._draw.createElement("div", "character-details");

    const name = this._draw.createElement("div", "character-name");
    this._draw.setId(name, "characterName");
    this._draw.setText(name, "캐릭터를 선택하세요");

    const stats = this._draw.createElement("div", "character-stats");
    this._draw.setId(stats, "characterStats");

    const description = this._draw.createElement("div", "character-description");
    this._draw.setId(description, "characterDescription");
    this._draw.setText(description, "캐릭터 설명이 여기에 표시됩니다.");

    this._draw.appendChild(details, name);
    this._draw.appendChild(details, stats);
    this._draw.appendChild(details, description);

    // 우측 - 캐릭터 이미지 미리보기
    const imagePreview = this._draw.createElement("div", "character-image-preview");
    const previewImage = this._draw.createElement("img", "character-preview-image");
    this._draw.setId(previewImage, "characterPreviewImage");
    this._draw.setAttribute(previewImage, "alt", "Character Preview");
    this._draw.appendChild(imagePreview, previewImage);

    this._draw.appendChild(panel, details);
    this._draw.appendChild(panel, imagePreview);
    this._draw.appendChild(section, panel);

    return section;
  }

  /**
   * 캐릭터 선택 섹션 생성
   * @returns {HTMLElement} 생성된 캐릭터 선택 섹션 요소
   */
  createCharacterSelectionSection() {
    const section = this._draw.createElement("div", "character-selection-section");

    // 캐러셀
    const carousel = this._draw.createElement("div", "character-carousel");

    // 이전 버튼
    const prevBtn = this._draw.createElement("button", "carousel-nav-btn");
    this._draw.setId(prevBtn, "prevCharacterBtn");
    this._draw.setText(prevBtn, "◀");
    this.trackDomListener(prevBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "prev-character" });
    });

    // 캐릭터 카드 컨테이너
    const cardsContainer = this._draw.createElement("div", "character-cards");
    this._draw.setId(cardsContainer, "characterCards");

    // 다음 버튼
    const nextBtn = this._draw.createElement("button", "carousel-nav-btn");
    this._draw.setId(nextBtn, "nextCharacterBtn");
    this._draw.setText(nextBtn, "▶");
    this.trackDomListener(nextBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "next-character" });
    });

    this._draw.appendChild(carousel, prevBtn);
    this._draw.appendChild(carousel, cardsContainer);
    this._draw.appendChild(carousel, nextBtn);

    // 액션 버튼
    const actions = this._draw.createElement("div", "character-actions");

    const backBtn = this._draw.createElement("button", "character-action-btn");
    backBtn.textContent = "돌아가기";
    this.trackDomListener(backBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "back-to-menu" });
    });

    const startBtn = this._draw.createElement("button", "character-action-btn primary");
    this._draw.setId(startBtn, "startGameBtn");
    this._draw.setText(startBtn, "게임 시작");
    this.trackDomListener(startBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "start-game" });
    });

    this._draw.appendChild(actions, backBtn);
    this._draw.appendChild(actions, startBtn);

    this._draw.appendChild(section, carousel);
    this._draw.appendChild(section, actions);

    return section;
  }

  /**
   * 캐릭터 표시 업데이트
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} character
   */
  updateCharacterInfo(character) {
    if (!character) return;

    // 캐릭터 이름 업데이트
    const nameEl = this._draw.getElementById("characterName");
    if (nameEl) this._draw.setText(nameEl, character.name);

    // 캐릭터 스탯 업데이트
    const statsEl = this._draw.getElementById("characterStats");
    if (statsEl) {
      this._draw.removeAllChild(statsEl);
      this.createCharacterStates(statsEl, "체력", character.hp);
      this.createCharacterStates(statsEl, "골드", character.gold);
    }

    // TODO: 캐릭터 설명
    const descEl = this._draw.getElementById("characterDescription");
    if (descEl) this._draw.setText(descEl, character.description);

    // TODO: 미리보기 이미지
    const previewImg = this._draw.getElementById("characterPreviewImage");
    if (previewImg) {
      this._draw.setAttribute(previewImg, "alt", `player_${character.id}`);
      // TODO: 이미지 경로는 나중에 설정
      // this._draw.setAttribute(previewImg, 'src', `path/to/character_${character.id}_preview.png`);
    }
  }

  /**
   * 캐릭터 카드 업데이트
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} prevCharacter
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} currentCharacter
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} nextCharacter
   */
  updateCharacterCards(prevCharacter, currentCharacter, nextCharacter) {
    const container = this._draw.getElementById("characterCards");
    if (!container) return;

    this._draw.removeAllChild(container);

    // 이전 캐릭터 카드
    const prevCard = this.createCharacterCard(prevCharacter, "side");
    this.trackDomListener(prevCard, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "prev-character" });
    });

    // 현재 캐릭터 카드
    const currentCard = this.createCharacterCard(currentCharacter, "current");

    // 다음 캐릭터 카드
    const nextCard = this.createCharacterCard(nextCharacter, "side");
    this.trackDomListener(nextCard, "click", () => {
      this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, { button: "next-character" });
    });

    this._draw.appendChild(container, prevCard);
    this._draw.appendChild(container, currentCard);
    this._draw.appendChild(container, nextCard);
  }

  /**
   * 캐릭터 카드 생성
   * @param {typeof CHARACTERS[keyof typeof CHARACTERS]} character 캐릭터 정보
   * @param {'side'|'current'} type 카드 유형
   * @returns {HTMLElement} 생성된 캐릭터 카드 요소
   */
  createCharacterCard(character, type) {
    const card = this._draw.createElement("div", `character-card ${type}`);

    const imageContainer = this._draw.createElement("div", "character-card-image");
    this._draw.setText(imageContainer, `player_${character.id}`);

    const nameLabel = this._draw.createElement("div", "character-card-name");
    this._draw.setText(nameLabel, character.name);

    this._draw.appendChild(card, imageContainer);
    this._draw.appendChild(card, nameLabel);

    return card;
  }

  /**
   * 캐릭터 상태 생성
   * @param {HTMLElement} element 부모 요소
   * @param {string} name 상태명칭
   * @param {any} value 상태값
   */
  createCharacterStates(element, name, value) {
    const statItem = this._draw.createElement("div", "stat-item");
    const statLabel = this._draw.createElement("div", "stat-label");
    this._draw.setText(statLabel, name);

    const statValue = this._draw.createElement("div", "stat-value");
    this._draw.setText(statValue, String(value));

    this._draw.appendChild(statItem, statLabel);
    this._draw.appendChild(statItem, statValue);

    this._draw.appendChild(element, statItem);
  }

  /**
   * 메뉴 버튼 생성
   * @param {string} text 버튼 텍스트
   * @param {string} id 버튼 ID
   * @param {boolean} disabled 비활성화 여부
   * @param {boolean} secondary 세컨더리 스타일 여부
   * @returns {HTMLElement} 생성된 버튼 요소
   */
  createMenuButton(text, id, disabled = false, secondary = false) {
    const button = this._draw.createElement("button", "menu-btn");
    this._draw.setId(button, id);
    this._draw.setText(button, text);
    this._draw.setDisabled(button, disabled);

    if (secondary) {
      this._draw.addClass(button, "secondary");
    }

    return button;
  }

  /**
   * 메뉴 장식 요소 추가
   * @param {HTMLElement} screen
   */
  addMenuDecorations(screen) {
    // 카드 장식
    const positions = ["top-left", "top-right", "bottom-left", "bottom-right"];
    positions.forEach((pos) => {
      const card = this._draw.createElement("div", "card-decoration");
      this._draw.addClass(card, pos);
      this._draw.appendChild(screen, card);
    });

    // 칩 장식
    const chipTop = this._draw.createElement("div", "chip-decoration");
    this._draw.addClass(chipTop, "top");
    this._draw.appendChild(screen, chipTop);

    const chipBottom = this._draw.createElement("div", "chip-decoration");
    this._draw.addClass(chipBottom, "bottom");
    this._draw.appendChild(screen, chipBottom);
  }

  /**
   * Debug 패널 생성
   */
  createDebugPanel() {
    const panel = this._draw.createElement("div", "debug-panel");
    this._draw.setId(panel, "debugPanel");
    this._draw.setDisplay(panel, "none");

    // 헤더
    const header = this.createDebugHeader();

    // 탭 메뉴
    const tabs = this.createDebugTabs();

    // 컨텐츠 영역
    const content = this._draw.createElement("div", "debug-content");
    this._draw.setId(content, "debugContent");

    this._draw.appendChild(panel, header);
    this._draw.appendChild(panel, tabs);
    this._draw.appendChild(panel, content);

    this._draw.appendChild(document.body, panel);

    // 드래그 기능 추가
    this.enableDragPanel(panel, header); // 이 줄 추가
  }

  /**
   * Debug 헤더 생성
   * @returns {HTMLElement}
   */
  createDebugHeader() {
    const header = this._draw.createElement("div", "debug-header");

    const title = this._draw.createElement("div", "debug-title");
    this._draw.setText(title, "🔧 Debug Panel");

    const controls = this._draw.createElement("div", "debug-controls");

    // 접기/펼치기 버튼
    const collapseBtn = this._draw.createElement("button", "debug-btn");
    this._draw.setId(collapseBtn, "debugCollapseBtn");
    this._draw.setText(collapseBtn, "−");
    this.trackDomListener(collapseBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.ACTION.DEBUG.COLLAPSE_TOGGLE, {});
    });

    // 닫기 버튼
    const closeBtn = this._draw.createElement("button", "debug-btn");
    this._draw.setText(closeBtn, "x");
    this.trackDomListener(closeBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.ACTION.DEBUG.TOGGLE, {});
    });

    this._draw.appendChild(controls, collapseBtn);
    this._draw.appendChild(controls, closeBtn);
    this._draw.appendChild(header, title);
    this._draw.appendChild(header, controls);

    return header;
  }

  /**
   * Debug 탭 생성
   * @returns {HTMLElement}
   */
  createDebugTabs() {
    const tabsContainer = this._draw.createElement("div", "debug-tabs");
    this._draw.setId(tabsContainer, "debugTabs");

    const tabs = [
      { id: "events", label: "Events" },
      { id: "state", label: "GameState" },
      { id: "loop", label: "GameLoop" },
      { id: "errors", label: "Errors" },
    ];

    tabs.forEach((tab) => {
      const tabBtn = this._draw.createElement("button", "debug-tab");
      this._draw.setText(tabBtn, tab.label);
      this._draw.addDataset(tabBtn, "tab", tab.id);

      if (tab.id === "events") {
        this._draw.addClass(tabBtn, "active");
      }

      this.trackDomListener(tabBtn, EVENTS.DOM.CLICK, () => {
        this.eventBus.emit(EVENTS.ACTION.DEBUG.CHANGE_TAB, { tabId: tab.id });
      });

      this._draw.appendChild(tabsContainer, tabBtn);
    });

    return tabsContainer;
  }

  /**
   * Debug 토글 이벤트 핸들러
   * @param {Object} data
   * @param {boolean} data.isActive 디버깅 활성화 상태
   * @param {string} data.currentTab 현재 탭
   */
  onDebugToggled(data) {
    const { isActive, currentTab } = data;

    const panel = this._draw.getElementById("debugPanel");
    if (panel) {
      this._draw.setDisplay(panel, isActive ? "flex" : "none");

      if (isActive) {
        // 패널이 열리면 RenderManager에 렌더링 요청
        this.eventBus.emit(EVENTS.RENDER.DEBUG_PANEL, {
          tab: currentTab,
        });
      }
    }
  }

  /**
   * Debug 탭 변경 이벤트 핸들러
   * @param {Object} data
   * @param {string} data.currentTab 현재 탭
   */
  onDebugTabChanged(data) {
    const { currentTab } = data;
    // 탭 버튼 활성화 상태 변경
    const tabButtons = document.querySelectorAll(".debug-tab");
    tabButtons.forEach((btn) => {
      if (this._draw.getDataset(btn, "tab") === currentTab) {
        this._draw.addClass(btn, "active");
      } else {
        this._draw.removeClass(btn, "active");
      }
    });

    // RenderManager에 렌더링 요청
    this.eventBus.emit(EVENTS.RENDER.DEBUG_PANEL, {
      tab: currentTab,
    });
  }

  /**
   * Debug 접기/펼치기 이벤트 핸들러
   * @param {Object} data
   * @param {boolean} data.isCollapsed Debug 패널 축소 여부
   */
  onDebugCollapsed(data) {
    const { isCollapsed } = data;
    const panel = this._draw.getElement("#debugPanel");
    const tabs = this._draw.getElementById("debugTabs");
    const content = this._draw.getElementById("debugContent");
    const collapseBtn = this._draw.getElementById("debugCollapseBtn");

    if (tabs && content && collapseBtn) {
      if (isCollapsed) {
        this._draw.setDisplay(tabs, "none");
        this._draw.setDisplay(content, "none");
        this._draw.setText(collapseBtn, "+");
        this._draw.addStyle(panel, {
          height: "auto",
          minHeight: "auto",
          resize: "none",
        });
      } else {
        this._draw.setDisplay(tabs, "flex");
        this._draw.setDisplay(content, "block");
        this._draw.setText(collapseBtn, "−");
        this._draw.addStyle(panel, {
          height: "",
          minHeight: "300px",
          resize: "both",
        });
      }
    }
  }

  /**
   * Debug 패널 드래그 기능 활성화
   * @param {HTMLElement} panel
   * @param {HTMLElement} dragHandle
   */
  enableDragPanel(panel, dragHandle) {
    let isDragging = false;
    let currentX = 10; // 10px 시작
    let currentY = 10; // 10px 시작
    let initialX = 0;
    let initialY = 0;

    const dragStart = (e) => {
      if (e.type === EVENTS.DOM.TOUCHSTART) {
        initialX = e.touches[0].clientX - currentX;
        initialY = e.touches[0].clientY - currentY;
      } else {
        initialX = e.clientX - currentX;
        initialY = e.clientY - currentY;
      }

      if (e.target === dragHandle || dragHandle.contains(e.target)) {
        isDragging = true;
      }
    };

    const dragEnd = (e) => {
      isDragging = false;
    };

    const drag = (e) => {
      if (isDragging) {
        e.preventDefault();

        if (e.type === EVENTS.DOM.TOUCHMOVE) {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        this._draw.addStyle(panel, {
          left: currentX + "px",
          top: currentY + "px",
          right: "auto",
        });
      }
    };

    this.trackDomListener(dragHandle, EVENTS.DOM.MOUSEDOWN, dragStart);
    this.trackDomListener(document, EVENTS.DOM.MOUSEMOVE, drag);
    this.trackDomListener(document, EVENTS.DOM.MOUSEUP, dragEnd);

    // 터치 이벤트
    this.trackDomListener(dragHandle, EVENTS.DOM.TOUCHSTART, dragStart);
    this.trackDomListener(document, EVENTS.DOM.TOUCHMOVE, drag);
    this.trackDomListener(document, EVENTS.DOM.TOUCHEND, dragEnd);
  }

  update(deltaTime) {}
}
