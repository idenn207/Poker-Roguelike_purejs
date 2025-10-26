/**
 * 파일위치: /src/managers/RenderManager.js
 * 파일명: RenderManager.js
 * 용도: 렌더링 관리
 * 기능: 게임 오브젝트 렌더링 (현재는 사용 안 함)
 * 책임: 게임 화면 렌더링 관리
 */

'use strict';
// @ts-check

class RenderManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    console.debug('RenderManager Initialized');
  }

  /** 렌더링 초기화 */
  init() {
    console.debug('RenderManager init complete');
  }

  /** 렌더링 이벤트 등록 */
  registerEvents() {
    // Debug 패널 렌더링 요청 구독
    this.trackEventBusListener(this.eventBus, EVENTS.RENDER.DEBUG_PANEL, this.renderDebugPanel.bind(this));

    // Debug 루프 업데이트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.LOOP_UPDATED, this.updateDebugLoopDisplay.bind(this));

    // Debug 이벤트 추가 구독
    this.trackEventBusListener(this.eventBus, EVENTS.STATE.DEBUG.EVENT_ADDED, this.updateDebugEventDisplay.bind(this));

    console.debug('RenderManager events registered');
  }

  /**
   * Debug 패널 렌더링
   * @param {Object} data
   * @param {string} data.tab
   */
  renderDebugPanel(data) {
    const { tab } = data;
    const content = this.draw.getElementById('debugContent');

    if (!content) return;

    this.draw.removeAllChild(content);

    switch (tab) {
      case 'events':
        this.renderEventsTab(content);
        break;
      case 'state':
        this.renderStateTab(content);
        break;
      case 'loop':
        this.renderLoopTab(content);
        break;
    }
  }

  /**
   * Events 탭 렌더링
   * @param {HTMLElement} container
   */
  renderEventsTab(container) {
    // 컨트롤 바
    const controls = this.draw.createElement('div', 'debug-section-controls');

    const clearBtn = this.draw.createElement('button', 'debug-btn small');
    this.draw.setText(clearBtn, 'Clear Log');
    this.trackDomListener(clearBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.clearEventLog();
      this.draw.removeAllChild(container);
      this.renderEventsTab(container);
    });

    const registeredBtn = this.draw.createElement('button', 'debug-btn small');
    this.draw.setText(registeredBtn, 'Show Registered');
    this.trackDomListener(registeredBtn, EVENTS.DOM.CLICK, () => {
      const events = this.eventBus.getRegisteredEvents();
      console.group('📋 Registered Events');
      events.forEach((event) => {
        console.log(`${event.eventName} (${event.listenerCount} listeners)`);
      });
      console.groupEnd();
    });

    this.draw.appendChild(controls, clearBtn);
    this.draw.appendChild(controls, registeredBtn);

    // 이벤트 로그 테이블
    const logContainer = this.draw.createElement('div', 'debug-log-container');
    this.draw.setId(logContainer, 'eventLogContainer');

    const table = this.createEventLogTable();
    this.draw.appendChild(logContainer, table);

    this.draw.appendChild(container, controls);
    this.draw.appendChild(container, logContainer);
  }

  /**
   * 이벤트 로그 테이블 생성
   * @returns {HTMLElement}
   */
  createEventLogTable() {
    const table = this.draw.createElement('table', 'debug-table');

    // 헤더
    const thead = this.draw.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>Time</th>
        <th>Event</th>
        <th>Listeners</th>
        <th>Data</th>
      </tr>
    `;

    // 바디
    const tbody = this.draw.createElement('tbody');
    this.draw.setId(tbody, 'eventLogBody');

    const logs = this.eventBus.getEventLog();
    logs.forEach((log) => {
      const row = this.draw.createElement('tr');
      this.draw.setHTML(
        row,
        `
        <td class="time">${log.time}</td>
        <td class="event-name">${log.eventName}</td>
        <td class="listener-count">${log.listenerCount}</td>
        <td class="data"><pre>${JSON.stringify(log.data, null, 2)}</pre></td>
      `
      );
      this.draw.appendChild(tbody, row);
    });

    this.draw.appendChild(table, thead);
    this.draw.appendChild(table, tbody);

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
    this.draw.setHTML(container, '<div class="debug-info">Loading state...</div>');

    this.trackEventBusListener(this.eventBus, EVENTS.RESPONSE.GAME.STATE, responseHandler);
    this.eventBus.emit(EVENTS.QUERY.GAME.STATE, { requestId });
  }

  /**
   * GameState 표시
   * @param {HTMLElement} container
   * @param {GameState} state
   */
  displayGameState(container, state) {
    this.draw.removeAllChild(container);

    const stateContainer = this.draw.createElement('div', 'debug-state-container');

    const sections = [
      { title: 'Screen', data: { current: state.currentScreen, previous: state.previousScreen } },
      { title: 'Game', data: { active: state.isGameActive, newGame: state.isNewGame } },
      { title: 'Stage', data: state.stage },
      { title: 'Player', data: state.player },
    ];

    sections.forEach((section) => {
      const sectionEl = this.draw.createElement('div', 'debug-state-section');

      const title = this.draw.createElement('div', 'debug-state-title');
      this.draw.setText(title, section.title);

      const content = this.draw.createElement('pre', 'debug-state-content');
      this.draw.setText(content, JSON.stringify(section.data, null, 2));

      this.draw.appendChild(sectionEl, title);
      this.draw.appendChild(sectionEl, content);
      this.draw.appendChild(stateContainer, sectionEl);
    });

    this.draw.appendChild(container, stateContainer);
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
    const debugInfo = this.draw.createElement('div', 'debug-info');
    this.draw.setText(debugInfo, 'Loading loop info...');
    this.draw.appendChild(container, debugInfo);
  }

  /**
   * 루프 정보 표시
   * @param {HTMLElement} container
   * @param {Object} debugState
   */
  displayLoopInfo(container, debugState) {
    this.draw.removeAllChild(container);

    const loopContainer = this.draw.createElement('div', 'debug-loop-container');

    // FPS 정보
    const fpsSection = this.draw.createElement('div', 'debug-loop-section');
    this.draw.setHTML(
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
    const chartSection = this.draw.createElement('div', 'debug-loop-section');
    const chartTitle = this.draw.createElement('div', 'debug-loop-title');
    this.draw.setText(chartTitle, 'FPS History');

    const chart = this.draw.createElement('div', 'debug-fps-chart');
    this.draw.setId(chart, 'debugFpsChart');

    this.draw.appendChild(chartSection, chartTitle);
    this.draw.appendChild(chartSection, chart);

    this.draw.appendChild(loopContainer, fpsSection);
    this.draw.appendChild(loopContainer, chartSection);
    this.draw.appendChild(container, loopContainer);

    // FPS 차트 렌더링
    this.renderFpsChart(debugState.fpsHistory);
  }

  /**
   * FPS 차트 렌더링
   * @param {Array<number>} fpsHistory
   */
  renderFpsChart(fpsHistory) {
    const chart = this.draw.getElementById('debugFpsChart');
    if (!chart) return;

    this.draw.removeAllChild(chart);

    const maxFps = 60;
    const barWidth = 100 / 60; // 최대 60개

    fpsHistory.forEach((fps, index) => {
      const bar = this.draw.createElement('div', 'fps-bar');
      const height = (fps / maxFps) * 100;
      this.draw.setStyles(bar, {
        width: `${barWidth}%`,
        height: `${Math.min(height, 100)}%`,
      });

      // 색상
      let background;
      if (fps >= 55) background = '#4ade80';
      else if (fps >= 30) background = '#fbbf24';
      else background = '#ef4444';
      this.draw.setStyles(bar, { background });

      this.draw.appendChild(chart, bar);
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

    const fpsEl = this.draw.getElementById('debugFps');
    const avgFpsEl = this.draw.getElementById('debugAvgFps');
    const deltaEl = this.draw.getElementById('debugDelta');
    const totalTimeEl = this.draw.getElementById('debugTotalTime');

    if (fpsEl) this.draw.setText(fpsEl, fps.toString());
    if (avgFpsEl) this.draw.setText(avgFpsEl, avgFps.toFixed(1));
    if (deltaEl) this.draw.setText(deltaEl, deltaTime.toFixed(2) + 'ms');
    if (totalTimeEl) this.draw.setText(totalTimeEl, (totalTime / 1000).toFixed(1) + 's');

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
    const tbody = this.draw.getElementById('eventLogBody');
    if (!tbody) return;

    const log = data.event;
    const row = this.draw.createElement('tr');
    this.draw.setHTML(
      row,
      `
      <td class="time">${log.time}</td>
      <td class="event-name">${log.eventName}</td>
      <td class="listener-count">${log.listenerCount}</td>
      <td class="data"><pre>${JSON.stringify(log.data, null, 2)}</pre></td>
    `
    );
    tbody.insertBefore(row, tbody.firstChild);

    // 최대 표시 개수 유지
    while (tbody.children.length > 50) {
      this.draw.removeChild(tbody, tbody.lastChild);
    }
  }

  update(deltaTime) {
    // 렌더링 로직 (현재는 UI가 CSS로 처리되므로 비어있음)
  }
}
