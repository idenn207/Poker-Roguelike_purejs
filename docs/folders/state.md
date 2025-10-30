# State 폴더

## 역할

게임의 전역 상태 데이터를 저장하고 관리하는 순수 데이터 클래스들입니다.

## 주요 기능

- 게임 상태 데이터 저장
- 상태 접근자 메서드 제공
- 데이터 구조 정의

## 책임

- 상태 데이터 저장 (로직 없음)
- 타입 정의 및 초기값 설정
- 데이터 접근 인터페이스 제공

## 클래스 구조

### GameState

게임의 핵심 상태 데이터를 저장합니다.

**주요 속성:**

```javascript
{
    // 화면 상태
    currentScreen: 'logo',
    previousScreen: null,

    // 캐릭터 선택
    availableCharacters: [...],
    currentCharacterIndex: 0,
    selectedCharacter: null,

    // 게임 진행도
    stage: {
        current: 1,
        maxReached: 1,
        type: null
    },

    // 플레이어 데이터
    player: {
        character: null,
        hp: 100,
        maxHp: 100,
        golds: 250,
        items: [],
        deck: null,
        relics: []
    },

    // 전투 상태
    combat: {
        isActive: false,
        enemies: [],
        turn: 0,
        playerTurn: true
    },

    // 게임 설정
    settings: {
        debug: false,
        volume: 0.5,
        difficulty: 'normal'
    }
}
```

**접근자 메서드:**

- `getCurrentScreen()`: 현재 화면 조회
- `getCurrentCharacter()`: 현재 선택 중인 캐릭터
- `getSelectedCharacter()`: 최종 선택된 캐릭터
- `getPlayer()`: 플레이어 정보

### DebugState

디버그 패널 관련 상태를 저장합니다.

**주요 속성:**

```javascript
{
    // 패널 상태
    isActive: false,
    currentTab: 'events',
    isCollapsed: false,

    // 루프 정보
    loopInfo: {
        fps: 0,
        deltaTime: 0,
        totalTime: 0,
        frameCount: 0,
        avgFps: 0,
        running: false,
        paused: false
    },

    // 히스토리
    fpsHistory: [],
    recentEvents: []
}
```

## 설계 원칙

### 1. 순수 데이터 클래스

- 비즈니스 로직 없음
- 단순 getter/setter만 제공
- 데이터 검증은 StateManager가 담당

### 2. 불변성 보장

- StateManager를 통해서만 수정
- 직접 수정 금지 (private 필드 고려)

### 3. 타입 안정성

- JSDoc을 통한 타입 정의
- 초기값으로 타입 명시

## 의존성

- **의존하는 것**: 없음
- **의존받는 것**: StateManager

## 데이터 흐름

```plaintext
ACTION 이벤트
    ↓
StateManager (검증 및 수정)
    ↓
GameState/DebugState (데이터 저장)
    ↓
STATE 이벤트 (변경 알림)
```

## 확장 가능성

- 새로운 상태 속성 추가 용이
- 별도의 State 클래스 생성 가능 (예: SettingsState)
- 상태 직렬화/역직렬화로 저장/불러오기 구현 가능
