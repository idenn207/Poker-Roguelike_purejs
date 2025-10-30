# Game Lifecycle

```javascript
/**
 * 파일 위치: /docs/game-lifecycle.md
 *
 * 로그라이크 카드 게임 생명주기
 */

// ============================================
// 1. 애플리케이션 수준 (Application Level)
// ============================================

BOOT → INIT → MENU → [RUN LOOP] → SHUTDOWN

/**
 * BOOT: 엔진/프레임워크 부팅
 * - 캔버스 초기화
 * - 기본 시스템 로드
 */

/**
 * INIT: 게임 초기화 (GameManager.init())
 * - EventBus 생성
 * - 모든 Manager 초기화
 * - 리소스 로드 (이미지, 사운드, 데이터)
 * - 세이브 데이터 로드
 */

/**
 * MENU: 메인 메뉴
 * - 새 게임 / 계속하기
 * - 설정
 * - 카드 도감
 */

/**
 * RUN LOOP: 실제 플레이 (Run = 1회 플레이스루)
 */

/**
 * SHUTDOWN: 종료
 * - 세이브
 * - 리소스 정리
 */

// ============================================
// 2. Run 수준 (Single Playthrough)
// ============================================

RUN_START → [STAGES] → RUN_END

/**
 * RUN_START: 새 Run 시작
 * 1. 캐릭터 선택
 * 2. 시작 덱 설정
 * 3. 시작 유물(Relic) 설정
 * 4. 초기 체력/골드 설정
 * 5. Neow 보너스 선택 (2번째 Run부터)
 *
 * 이벤트: GAME.STARTED, STAGE.STARTED
 */

/**
 * STAGES: Act 1 → Act 2 → Act 3 → (Boss)
 */

/**
 * RUN_END: Run 종료
 * - 승리: 점수 계산, 언락 확인
 * - 패배: 통계 기록
 * - 메타 진행도 업데이트
 *
 * 이벤트: GAME.VICTORY or GAME.OVER
 */

// ============================================
// 3. Stage/Act 수준 (하나의 Act)
// ============================================

ACT_START → [NODES] → BOSS → ACT_END

/**
 * ACT_START: Act 시작
 * - 맵 생성 (절차적 생성)
 * - 경로 선택지 표시
 *
 * 이벤트: STAGE.STARTED
 */

/**
 * NODES: 노드 선택 및 진행
 * - Combat (일반 전투)
 * - Elite (엘리트 전투)
 * - Rest Site (휴식/업그레이드)
 * - Shop (상점)
 * - Treasure (보물방)
 * - Event (랜덤 이벤트)
 * - ? (미지의 방)
 */

/**
 * BOSS: 보스 전투
 *
 * 이벤트: STAGE.BOSS_STAGE, COMBAT.STARTED
 */

/**
 * ACT_END: Act 완료
 * - 다음 Act로 or Run 종료
 *
 * 이벤트: STAGE.COMPLETED
 */

// ============================================
// 4. Combat 수준 (전투)
// ============================================

COMBAT_START → [TURNS] → COMBAT_END → REWARD

/**
 * COMBAT_START: 전투 시작
 * 1. 적 생성 및 배치
 * 2. 덱 셔플
 * 3. 초기 핸드 드로우
 * 4. 시작 버프/디버프 적용
 *
 * 이벤트: COMBAT.STARTED
 */

/**
 * TURNS: 턴 반복
 * [PLAYER_TURN] ↔ [ENEMY_TURN]
 */

/**
 * COMBAT_END: 전투 종료
 * - 승리/패배 판정
 * - 임시 버프/디버프 정리
 *
 * 이벤트: COMBAT.ENDED
 */

/**
 * REWARD: 보상 선택
 * - 카드 선택 (3장 중 1장 or 스킵)
 * - 골드 획득
 * - (Elite) 유물 획득
 * - 포션 획득 (확률)
 *
 * 이벤트: REWARD.SCREEN_OPENED
 */

// ============================================
// 5. Turn 수준 (한 턴)
// ============================================

// 플레이어 턴
TURN_START → DRAW → [ACTIONS] → TURN_END

/**
 * TURN_START: 턴 시작
 * - 턴 카운터 증가
 * - 에너지 리필
 * - 턴 시작 효과 발동
 *
 * 이벤트: COMBAT.TURN_STARTED
 */

/**
 * DRAW: 카드 드로우
 * - 핸드 리필 (보통 5장)
 * - 덱이 비면 버린 카드 더미 셔플
 *
 * 이벤트: CARD.DRAWN (각 카드마다)
 */

/**
 * ACTIONS: 플레이어 액션 (동시 또는 순차)
 * - 카드 플레이
 * - 카드 버리기
 * - 포션 사용
 * - (특수) 유물 효과 발동
 *
 * 이벤트: CARD.PLAYED, CARD.DISCARDED, etc.
 */

/**
 * TURN_END: 턴 종료
 * - 남은 핸드 버리기
 * - 턴 종료 효과 발동
 * - 버프/디버프 지속시간 감소
 * - 적 턴으로 전환
 *
 * 이벤트: COMBAT.TURN_ENDED
 */

// 적 턴
ENEMY_TURN_START → ENEMY_ACTIONS → ENEMY_TURN_END

/**
 * ENEMY_TURN_START
 * - 각 적의 Intent 결정 (다음 행동)
 *
 * 이벤트: ENEMY.INTENT_CHANGED
 */

/**
 * ENEMY_ACTIONS
 * - 공격/방어/버프/디버프/특수 행동
 *
 * 이벤트: ENEMY.ACTION_COMPLETED
 */

/**
 * ENEMY_TURN_END
 * - 적 버프/디버프 지속시간 감소
 * - 플레이어 턴으로 전환
 */

// ============================================
// 6. Card 수준 (카드 생명주기)
// ============================================

CREATED → IN_DECK → DRAWN → IN_HAND → [PLAYED/DISCARDED] → DISCARD_PILE → (EXHAUST)

/**
 * CREATED: 카드 생성
 * - 보상, 상점, 이벤트에서
 *
 * 이벤트: CARD.CREATED
 */

/**
 * IN_DECK: 덱에 존재
 * - 드로우 대기 중
 */

/**
 * DRAWN: 드로우됨
 * - 덱에서 핸드로
 *
 * 이벤트: CARD.DRAWN
 */

/**
 * IN_HAND: 핸드에 존재
 * - 플레이 가능 상태
 * - 선택/호버 가능
 *
 * 이벤트: CARD.SELECTED, CARD.HOVERED
 */

/**
 * PLAYED: 카드 사용
 * - 효과 발동
 * - 버린 카드 더미로 (보통)
 *
 * 이벤트: CARD.PLAYED
 */

/**
 * DISCARDED: 카드 버림
 * - 턴 종료 시 or 효과로
 *
 * 이벤트: CARD.DISCARDED
 */

/**
 * DISCARD_PILE: 버린 카드 더미
 * - 덱이 비면 다시 셔플
 */

/**
 * EXHAUST: 소진 (선택적)
 * - 게임에서 제거 (이번 전투 한정)
 *
 * 이벤트: CARD.EXHAUSTED
 */

// ============================================
// 7. 상태 전환 다이어그램
// ============================================

/**
 * 게임 전체 상태
 */
enum GameState {
    BOOTING,      // 부팅 중
    LOADING,      // 로딩 중
    MAIN_MENU,    // 메인 메뉴
    CHAR_SELECT,  // 캐릭터 선택
    MAP,          // 맵 화면
    COMBAT,       // 전투
    REWARD,       // 보상
    SHOP,         // 상점
    REST,         // 휴식
    EVENT,        // 이벤트
    GAME_OVER,    // 게임 오버
    VICTORY       // 승리
}

/**
 * 전투 페이즈
 */
enum CombatPhase {
    STARTING,     // 전투 시작 중
    PLAYER_TURN,  // 플레이어 턴
    ENEMY_TURN,   // 적 턴
    ENDING        // 전투 종료 중
}

/**
 * 턴 페이즈
 */
enum TurnPhase {
    START,        // 턴 시작
    DRAW,         // 드로우
    MAIN,         // 메인 페이즈 (카드 플레이)
    END           // 턴 종료
}
```
