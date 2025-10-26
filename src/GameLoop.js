/**
 * 게임 시작
 *    ↓
 * ┌─────────────────┐
 * │  GameLoop 시작  │
 * └─────────────────┘
 *    ↓
 * ┌─────────────────┐
 * │  1. 입력 처리   │ ← 키보드, 마우스
 * └─────────────────┘
 *    ↓
 * ┌─────────────────┐
 * │  2. 게임 로직   │ ← 위치 계산, 충돌 검사
 * └─────────────────┘
 *    ↓
 * ┌─────────────────┐
 * │  3. 렌더링      │ ← 화면에 그리기
 * └─────────────────┘
 *    ↓
 *    └──→ (반복) 60fps = 초당 60번 반복
 *
 * 역할
 * - 일정한 속도로 게임 업데이트
 * - FPS(Frame Per Second) 관리
 * - deltaTime 계산 (프레임 간 시간 차이)
 * - 게임 상태 관리 (게임 일시정지/재개, 게임 속도 조절 (슬로우 모션), 게임 종료 처리)
 * - 성능 모니터링 (실제 FPS 측정, 성능 통계 수집)
 *
 * 기능
 * - 브라우저와 동기화된 애니메이션 루프 관리
 * - deltaTime 계산
 *
 * 책임
 * - 프레임 타이밍만 관리
 * - update() / render() 호출 타이밍
 * - deltaTime 계산
 * - 루프 시작/정지
 */

class GameLoop {
  constructor() {
    this.running = false;
    this.lastTime = 0;
    this.currentTime = 0;
    this.deltaTime = 0;
    this.totalTime = 0;
    this.fps = 60;
    this.fpsTime = 0;
    this.frameCount = 0;
    this.lastFpsUpdate = 0;
    this.isPaused = false;
    this.debug = true;
    this.gameManager = new GameManager();

    console.debug('GameLoop Initialized');
  }

  /** 게임 시작 */
  start() {
    this.running = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.requestAnimationFrame(this.loop.bind(this));

    // 게임 초기화
    this.gameManager.init();
  }

  /** 게임 중지(종료) */
  stop() {
    this.running = false;
    this.isPaused = false;
  }

  /** 일시 정지 */
  pause() {
    this.running = false;
    this.isPaused = true;
  }

  /** 계속 */
  resume() {
    this.running = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.requestAnimationFrame(this.loop.bind(this));
  }

  /** 게임 루프 */
  loop() {
    if (!this.running) return;
    if (this.isPaused) {
      this.requestAnimationFrame(this.loop.bind(this));
      return;
    }

    this.currentTime = performance.now();

    // Delta time 계산
    this.#getDeltaTime(this.currentTime);

    // FPS 계산
    this.#getFPS(this.currentTime);

    // 업데이트
    this.update(this.deltaTime);

    // 렌더링
    this.render();

    // 다음 프레임 요청
    this.requestAnimationFrame(this.loop.bind(this));
  }

  /** 상태 업데이트 */
  update(deltaTime) {
    this.gameManager.update(deltaTime);
  }

  render() {}

  requestAnimationFrame(loop) {
    window.requestAnimationFrame(loop);
  }

  #getDeltaTime(currentTime) {
    this.deltaTime = currentTime - (this.lastTime || currentTime);
    this.lastTime = currentTime;
    return this.deltaTime;
  }

  #getFPS(currentTime) {
    this.fps = 0;
    this.fpsTime = currentTime - this.lastFpsUpdate;

    if (this.fpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }

    this.frameCount++;
    return this.fps;
  }

  getDebugInfo() {
    return {
      deltaTime: this.deltaTime,
      fps: this.fps,
      totalTime: this.totalTime,
    };
  }
}

// 테스트
const gameLoop = new GameLoop();
gameLoop.start();
