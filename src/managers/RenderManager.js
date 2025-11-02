/**
 * 파일위치: /src/managers/RenderManager.js
 * 파일명: RenderManager.js
 * 용도: 렌더링 관리
 * 기능: 게임 오브젝트 렌더링 (현재는 사용 안 함)
 * 책임: 게임 화면 렌더링 관리
 */

"use strict";
// @ts-check

class RenderManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    /**
     * @typedef {Object} RendererType
     * @property {TooltipRenderer} tooltip
     */
    /** @type {RendererType} */
    this.renderer = {
      tooltip: new TooltipRenderer(),
    };

    console.debug("RenderManager Initialized");
  }

  /** 렌더링 초기화 */
  init() {
    this.renderer.tooltip.init();

    console.debug("RenderManager init complete");
  }

  /** 렌더링 이벤트 등록 */
  registerEvents() {
    // Debug 관련
    this.trackEventBusListener(this.eventBus, EVENTS.RENDER.DEBUG_PANEL, this.renderDebugPanel.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.LOOP_UPDATED, this.updateDebugLoopDisplay.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.EVENT_ADDED, this.updateDebugEventDisplay.bind(this));
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.ERROR_ADDED, this.updateDebugErrorDisplay.bind(this));

    // 정보 요청
    this.trackEventBusListener(this.eventBus, EVENTS.QUERY.RENDER.TOOLTIP.POSITION, this.handleTooltipPositionQuery.bind(this));

    // 상태 관련
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.SHOP.PLAYER_INFO_UPDATED, this.renderShopPlayerInfo.bind(this));

    // 툴팁 관련
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.RENDER.TOOLTIP_UPDATED, this.renderTooltip.bind(this));

    console.debug("RenderManager events registered");
  }

  /**
   * Debug 패널 렌더링
   * @param {Object} data
   * @param {string} data.tab
   */
  renderDebugPanel(data) {
    const { tab } = data;
    const content = this._draw.getElementById("debugContent");

    if (!content) return;

    this._draw.removeAllChild(content);

    switch (tab) {
      case "events":
        this.renderEventsTab(content);
        break;
      case "state":
        this.renderStateTab(content);
        break;
      case "loop":
        this.renderLoopTab(content);
        break;
      case "errors":
        this.renderErrorsTab(content);
        break;
    }
  }

  /**
   * Events 탭 렌더링
   * @param {HTMLElement} container
   */
  renderEventsTab(container) {
    // 컨트롤 바
    const controls = this._draw.createElement("div", "debug-section-controls");

    const clearBtn = this._draw.createElement("button", "debug-btn small");
    this._draw.setText(clearBtn, "Clear Log");
    this.trackDomListener(clearBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.clearEventLog();
      this._draw.removeAllChild(container);
      this.renderEventsTab(container);
    });

    const registeredBtn = this._draw.createElement("button", "debug-btn small");
    this._draw.setText(registeredBtn, "Show Registered");
    this.trackDomListener(registeredBtn, EVENTS.DOM.CLICK, () => {
      const events = this.eventBus.getRegisteredEvents();
      console.group("📋 Registered Events");
      events.forEach((event) => {
        console.log(`${event.eventName} (${event.listenerCount} listeners)`);
      });
      console.groupEnd();
    });

    this._draw.appendChild(controls, clearBtn);
    this._draw.appendChild(controls, registeredBtn);

    // 이벤트 로그 테이블
    const logContainer = this._draw.createElement("div", "debug-log-container");
    this._draw.setId(logContainer, "eventLogContainer");

    const table = this.createEventLogTable();
    this._draw.appendChild(logContainer, table);

    this._draw.appendChild(container, controls);
    this._draw.appendChild(container, logContainer);
  }

  /**
   * 이벤트 로그 테이블 생성
   * @returns {HTMLElement}
   */
  createEventLogTable() {
    const table = this._draw.createElement("table", "debug-table");

    // 헤더
    const thead = this._draw.createElement("thead");
    this._draw.setHTML(
      thead,
      `
      <tr>
        <th>Time</th>
        <th>Event</th>
        <th>Listeners</th>
        <th>Data</th>
      </tr>
    `
    );

    // 바디
    const tbody = this._draw.createElement("tbody");
    this._draw.setId(tbody, "eventLogBody");

    const logs = this.eventBus.getEventLog();
    logs.forEach((log) => {
      const row = this._draw.createElement("tr");
      this._draw.setHTML(
        row,
        `
        <td class="time">${log.time}</td>
        <td class="event-name">${log.eventName}</td>
        <td class="listener-count">${log.listenerCount}</td>
        <td class="data"><pre>${json2stringCompact(log.data)}</pre></td>
      `
      );
      this._draw.appendChild(tbody, row);
    });

    this._draw.appendChild(table, thead);
    this._draw.appendChild(table, tbody);

    return table;
  }

  /**
   * GameState 탭 렌더링
   * @param {HTMLElement} container
   */
  renderStateTab(container) {
    // StateManager에 상태 요청
    const requestId = `debug_${Date.now()}`;

    // 응답 리스너 등록 (일회성)
    const responseHandler = (data) => {
      if (data.requestId === requestId) {
        this.displayGameState(container, data);
        this.cleanupListenersByType(EVENTS.RESPONSE.GAME.STATE);
      }
    };

    // 로딩 표시
    this._draw.setHTML(container, '<div class="debug-info">Loading state...</div>');

    this.trackEventBusListener(this.eventBus, EVENTS.RESPONSE.GAME.STATE, responseHandler);
    this.eventBus.emit(EVENTS.QUERY.GAME.STATE, { requestId });
  }

  /**
   * GameState 표시
   * @param {HTMLElement} container
   * @param {GameState} state
   */
  displayGameState(container, state) {
    this._draw.removeAllChild(container);

    const stateContainer = this._draw.createElement("div", "debug-state-container");

    const sections = [
      { title: "Screen", data: { current: state.currentScreen, previous: state.previousScreen } },
      { title: "Game", data: { active: state.isGameActive, newGame: state.isNewGame } },
      { title: "Stage", data: state.stage },
      { title: "Player", data: state.player },
    ];

    sections.forEach((section) => {
      const sectionEl = this._draw.createElement("div", "debug-state-section");

      const title = this._draw.createElement("div", "debug-state-title");
      this._draw.setText(title, section.title);

      const content = this._draw.createElement("pre", "debug-state-content");
      this._draw.setText(content, json2stringCompact(section.data));

      this._draw.appendChild(sectionEl, title);
      this._draw.appendChild(sectionEl, content);
      this._draw.appendChild(stateContainer, sectionEl);
    });

    this._draw.appendChild(container, stateContainer);
  }

  /**
   * GameLoop 탭 렌더링
   * @param {HTMLElement} container
   */
  renderLoopTab(container) {
    // StateManager에 Debug 상태 요청
    const requestId = `debug_loop_${Date.now()}`;

    // 응답 리스너 등록 (일회성)
    const responseHandler = (data) => {
      if (data.requestId === requestId) {
        this.displayLoopInfo(container, data);
        this.cleanupListenersByType(EVENTS.RESPONSE.DEBUG.STATE);
      }
    };

    this.trackEventBusListener(this.eventBus, EVENTS.RESPONSE.DEBUG.STATE, responseHandler);
    this.eventBus.emit(EVENTS.QUERY.DEBUG.STATE, { requestId });

    // 로딩 표시
    const debugInfo = this._draw.createElement("div", "debug-info");
    this._draw.setText(debugInfo, "Loading loop info...");
    this._draw.appendChild(container, debugInfo);
  }

  /**
   * 루프 정보 표시
   * @param {HTMLElement} container
   * @param {Object} debugState
   */
  displayLoopInfo(container, debugState) {
    this._draw.removeAllChild(container);

    const loopContainer = this._draw.createElement("div", "debug-loop-container");

    // FPS 정보
    const fpsSection = this._draw.createElement("div", "debug-loop-section");
    this._draw.setHTML(
      fpsSection,
      `
      <div class="debug-loop-title">Performance</div>
      <div class="debug-loop-stats">
        <div class="stat-item">
          <span class="stat-label">FPS:</span>
          <span class="stat-value" id="debugFps">${debugState.loopInfo.fps}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Avg FPS:</span>
          <span class="stat-value" id="debugAvgFps">${debugState.loopInfo.avgFps}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Delta Time:</span>
          <span class="stat-value" id="debugDelta">${debugState.loopInfo.deltaTime.toFixed(2)}ms</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Total Time:</span>
          <span class="stat-value" id="debugTotalTime">${(debugState.loopInfo.totalTime / 1000).toFixed(1)}s</span>
        </div>
      </div>
    `
    );

    // FPS 차트
    const chartSection = this._draw.createElement("div", "debug-loop-section");
    const chartTitle = this._draw.createElement("div", "debug-loop-title");
    this._draw.setText(chartTitle, "FPS History");

    const chart = this._draw.createElement("div", "debug-fps-chart");
    this._draw.setId(chart, "debugFpsChart");

    this._draw.appendChild(chartSection, chartTitle);
    this._draw.appendChild(chartSection, chart);

    this._draw.appendChild(loopContainer, fpsSection);
    this._draw.appendChild(loopContainer, chartSection);
    this._draw.appendChild(container, loopContainer);

    // FPS 차트 렌더링
    this.renderFpsChart(debugState.fpsHistory);
  }

  /**
   * Errors 탭 렌더링
   * @param {HTMLElement} container
   */
  renderErrorsTab(container) {
    // 컨트롤 바
    const controls = this._draw.createElement("div", "debug-section-controls");

    const clearBtn = this._draw.createElement("button", "debug-btn small");
    this._draw.setText(clearBtn, "Clear Errors");
    this.trackDomListener(clearBtn, EVENTS.DOM.CLICK, () => {
      // StateManager를 통해 에러 클리어
      const requestId = `clear_errors_${Date.now()}`;
      this.eventBus.emit(EVENTS.ACTION.DEBUG.CLEAR_ERRORS, { requestId });

      // 화면 새로고침
      this._draw.removeAllChild(container);
      this.renderErrorsTab(container);
    });

    this._draw.appendChild(controls, clearBtn);
    this._draw.appendChild(container, controls);

    // StateManager 에 Debug 상태 요청
    const requestId = `debug_errors_${Date.now()}`;

    const responseHandler = (data) => {
      if (data.requestId === requestId) {
        this.displayErrors(container, data.errors);
        this.cleanupListenersByType(EVENTS.RESPONSE.DEBUG.STATE);
      }
    };

    this.trackEventBusListener(this.eventBus, EVENTS.RESPONSE.DEBUG.STATE, responseHandler);
    this.eventBus.emit(EVENTS.QUERY.DEBUG.STATE, { requestId });
  }

  /**
   * 에러 목록 표시
   * @param {HTMLElement} container
   * @param {Array<Object>} errors
   */
  displayErrors(container, errors) {
    if (!errors || errors.length === 0) {
      const emptyMsg = this._draw.createElement("div", "debug-info");
      this._draw.setText(emptyMsg, "✅ No errors found");
      this._draw.appendChild(container, emptyMsg);
      return;
    }

    const errorList = this._draw.createElement("ul", "debug-error-list");

    errors.forEach((error, index) => {
      const errorItem = this._draw.createElement("div", "debug-error-item");

      // 에러 헤더
      const errorHeader = this._draw.createElement("div", "debug-error-header");

      const errorIndex = this._draw.createElement("span", "debug-error-index");
      this._draw.setText(errorIndex, `#${index + 1}`);

      const errorTime = this._draw.createElement("span", "debug-error-time");
      this._draw.setText(errorTime, error.time || new Date(error.timestamp).toLocaleTimeString());

      const errorType = this._draw.createElement("span", "debug-error-type");
      this._draw.setText(errorType, error.type || "ERROR");
      this._draw.addClass(errorType, this.getErrorTypeClass(error.type));

      this._draw.appendChild(errorHeader, errorIndex);
      this._draw.appendChild(errorHeader, errorTime);
      this._draw.appendChild(errorHeader, errorType);

      // 에러 메시지
      const errorMessage = this._draw.createElement("div", "debug-error-message");
      this._draw.setText(errorMessage, error.message || "Unknown error");
      this._draw.appendChild(errorItem, errorMessage);

      // 에러 상세 정보 (Collapse 기능 추가)
      const errorDetails = this._draw.createElement("details", "debug-error-details");
      const errorSummary = this._draw.createElement("summary", "");
      this._draw.setText(errorSummary, "▶ Details");

      const errorStack = this._draw.createElement("pre", "debug-error-stack");

      let detailsText = "";
      if (error.error && error.error.stack) {
        detailsText += `Stack:\n${error.error.stack}\n\n`;
      }
      if (error.filename) {
        detailsText += `File: ${error.filename}:${error.lineno}:${error.colno}\n\n`;
      }
      if (error.recentEvents && error.recentEvents.length > 0) {
        detailsText += `Recent Events (Last ${error.recentEvents.length}):\n`;
        error.recentEvents.forEach((evt, idx) => {
          detailsText += `  ${idx + 1}. [${evt.time}] ${evt.event}\n`;
        });
      }

      this._draw.setText(errorStack, detailsText || "NO additional details");

      this._draw.appendChild(errorDetails, errorSummary);
      this._draw.appendChild(errorDetails, errorStack);

      this._draw.appendChild(errorItem, errorHeader);
      this._draw.appendChild(errorItem, errorMessage);
      this._draw.appendChild(errorItem, errorDetails);

      this._draw.appendChild(errorList, errorItem);
    });

    this._draw.appendChild(container, errorList);
  }

  /**
   * 에러 타입에 따른 CSS 클래스 반환
   * @param {string} errorType
   * @returns {string}
   */
  getErrorTypeClass(errorType) {
    switch (errorType) {
      case "ERROR":
        return "error-type-error";
      case "UNHANDLED_REJECTION":
        return "error-type-rejection";
      case "MANUAL_ERROR":
        return "error-type-manual";
      default:
        return "error-type-default";
    }
  }

  /**
   * FPS 차트 렌더링
   * @param {Array<number>} fpsHistory
   */
  renderFpsChart(fpsHistory) {
    const chart = this._draw.getElementById("debugFpsChart");
    if (!chart) return;

    this._draw.removeAllChild(chart);

    const maxFps = 60;
    const barWidth = 100 / 60; // 최대 60개

    fpsHistory.forEach((fps, index) => {
      const bar = this._draw.createElement("div", "fps-bar");
      const height = (fps / maxFps) * 100;
      this._draw.addStyle(bar, {
        width: `${barWidth}%`,
        height: `${Math.min(height, 100)}%`,
      });

      // 색상
      let background;
      if (fps >= 55) background = "#4ade80";
      else if (fps >= 30) background = "#fbbf24";
      else background = "#ef4444";
      this._draw.addStyle(bar, { background });

      this._draw.appendChild(chart, bar);
    });
  }

  /**
   * Debug 루프 표시 업데이트
   * @param {Object} data
   * @param {LoofInfo} data.loopInfo
   */
  updateDebugLoopDisplay(data) {
    const { loopInfo = {} } = data;
    const { fps = 0, avgFps = 0, deltaTime = 0, totalTime = 0 } = loopInfo;

    const fpsEl = this._draw.getElementById("debugFps");
    const avgFpsEl = this._draw.getElementById("debugAvgFps");
    const deltaEl = this._draw.getElementById("debugDelta");
    const totalTimeEl = this._draw.getElementById("debugTotalTime");

    if (fpsEl) this._draw.setText(fpsEl, fps.toString());
    if (avgFpsEl) this._draw.setText(avgFpsEl, avgFps.toFixed(1));
    if (deltaEl) this._draw.setText(deltaEl, deltaTime.toFixed(2) + "ms");
    if (totalTimeEl) this._draw.setText(totalTimeEl, (totalTime / 1000).toFixed(1) + "s");

    this.renderFpsChart(data.fpsHistory);
  }

  /**
   * Debug 이벤트 표시 업데이트
   * @param {Object} data
   * @param {EventLog} data.event
   * @param {Array<EventLog>} data.recentEvents
   */
  updateDebugEventDisplay(data) {
    const { event, recentEvents } = data;
    const tbody = this._draw.getElementById("eventLogBody");
    if (!tbody) return;

    const log = data.event;
    const row = this._draw.createElement("tr");
    this._draw.setHTML(
      row,
      `
      <td class="time">${log.time}</td>
      <td class="event-name">${log.eventName}</td>
      <td class="listener-count">${log.listenerCount}</td>
      <td class="data"><pre>${json2stringCompact(log.data)}</pre></td>
    `
    );
    tbody.insertBefore(row, tbody.firstChild);

    // 최대 표시 개수 유지
    while (tbody.children.length > 50) {
      this._draw.removeChild(tbody, tbody.lastChild);
    }
  }

  /**
   * Debug 에러 표시 업데이트
   * @param {Object} data
   * @param {number} data.errorCount 에러 수
   */
  updateDebugErrorDisplay(data) {
    const { errorCount } = data;

    // Errors 탭이 활성화되어 있으면 자동 갱신
    const activeTab = this._draw.getElement(".debug-tab.active");
    if (activeTab && this._draw.getDataset(activeTab, "tab") === "errors") {
      const content = this._draw.getElementById("debugContent");
      if (content) {
        this._draw.removeAllChild(content);
        this.renderErrorsTab(content);
      }
    }

    // Errors 탭 버튼에 배지 표시
    const errorsTabBtn = this._draw.getElement('.debug-tab[data-tab="errors"]');
    if (errorsTabBtn && errorCount > 0) {
      // 기존 배지 제거
      const existingBadge = this._draw.getElement(".error-badge");
      if (existingBadge) {
        this._draw.remove(existingBadge);
      }

      // 새 배지 추가
      const badge = this._draw.createElement("span", "error-badge");
      this._draw.setText(badge, errorCount.toString());
      this._draw.appendChild(errorsTabBtn, badge);
    }
  }

  /**
   * 툴팁 렌더링
   * @param {Object} data
   * @param {UIState.tooltip} data.tooltipState - UIState.tooltip
   * @param {string} data.position - 'top' | 'bottom'
   */
  renderTooltip(data) {
    const { tooltipState, position } = data;

    if (this.renderer.tooltip) {
      this.renderer.tooltip.render(tooltipState);

      // position 클래스 업데이트
      const tooltipEl = this._draw.getElementById("globalTooltip");
      if (tooltipEl && tooltipState.isVisible) {
        this._draw.removeClass(tooltipEl, "position-top");
        this._draw.removeClass(tooltipEl, "position-bottom");
        this._draw.addClass(tooltipEl, `position-${position}`);
      }
    }
  }

  /**
   * 툴팁 위치 계산 요청 처리
   * @param {Object} data
   * @param {HTMLElement} data.target
   * @param {string} data.requestId
   */
  handleTooltipPositionQuery(data) {
    const { target, requestId } = data;

    if (this.renderer.tooltip) {
      const position = this.renderer.tooltip.calculatePosition(target);

      // StateManager에게 응답
      this.eventBus.emit(EVENTS.RESPONSE.RENDER.TOOLTIP.POSITION, {
        requestId: requestId,
        top: position.top,
        left: position.left,
        position: position.position,
      });
    }
  }

  /**
   * 상점 플레이어 정보 렌더링
   * @param {Object} data
   * @param {number} data.hp
   * @param {number} data.maxHp
   * @param {number} data.gold
   */
  renderShopPlayerInfo(data) {
    const { hp, maxHp, gold } = data;

    const hpEl = this._draw.getElementById("shopPlayerHp");
    const goldEl = this._draw.getElementById("shopPlayerGold");

    if (hpEl) this._draw.setText(hpEl, `${hp}/${maxHp}`);
    if (goldEl) this._draw.setText(goldEl, gold);
  }

  update(deltaTime) {
    // 렌더링 로직 (현재는 UI가 CSS로 처리되므로 비어있음)
  }
}
