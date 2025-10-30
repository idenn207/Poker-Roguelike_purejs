# 시스템 아키텍처

## 아키텍처 개요

이 프로젝트는 **이벤트 기반 아키텍처(Event-Driven Architecture)**를 채택하여 모듈 간 느슨한 결합을 유지합니다.

```plaintext
┌─────────────────────────────────────────────┐
│                   EventBus                   │
│              (중앙 통신 허브)                │
└─────────────────────────────────────────────┘
        ↑            ↑            ↑
        │            │            │
   ┌────┴────┐  ┌────┴────┐  ┌────┴────┐
   │ Manager │  │ Manager │  │ Manager │
   └────┬────┘  └────┬────┘  └────┬────┘
        │            │            │
        ↓            ↓            ↓
┌─────────────────────────────────────────────┐
│              StateManager                   │
│           (중앙 상태 관리)                  │
└─────────────────────────────────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│               GameState                     │
│           (전역 상태 데이터)                │
└─────────────────────────────────────────────┘
```

## 핵심 설계 원칙

### 1. 이벤트 기반 통신

- 모든 Manager는 EventBus를 통해 통신
- 직접 참조 금지, 의존성 최소화
- 발행-구독 패턴 사용

### 2. 중앙 상태 관리

- StateManager가 GameState의 유일한 관리자
- 다른 Manager는 StateManager를 통해서만 상태 변경
- 상태 변경 시 이벤트 발행으로 동기화

### 3. 단일 책임 원칙

- 각 Manager는 하나의 시스템만 관리
- 명확한 역할 분담
- 독립적인 테스트 가능

## 주요 컴포넌트

### EventBus

중앙 이벤트 허브로 모든 통신을 중재합니다.

**책임:**

- 이벤트 발행/구독 관리
- 이벤트 로깅
- 리스너 생명주기 관리

### StateManager

전역 상태의 유일한 관리자입니다.

**책임:**

- GameState 변경 관리
- 상태 변경 이벤트 발행
- 상태 조회 응답

### GameManager

게임 전체 흐름을 조율합니다.

**책임:**

- 모든 Manager 초기화
- 게임 루프와 Manager 연결
- 시스템 간 조율

## 데이터 흐름

### 1. 사용자 입력 흐름

```plaintext
사용자 입력
    ↓
UIManager (DOM 이벤트 감지)
    ↓
EventBus (INPUT 이벤트 발행)
    ↓
InputManager (입력 처리)
    ↓
EventBus (ACTION 이벤트 발행)
    ↓
StateManager (상태 변경)
    ↓
EventBus (STATE 이벤트 발행)
    ↓
각 Manager (UI 업데이트 등)
```

### 2. 상태 변경 흐름

```plaintext
ACTION 이벤트 수신
    ↓
StateManager (검증)
    ↓
GameState 수정
    ↓
STATE 변경 이벤트 발행
    ↓
구독 Manager들 반응
```

## Manager 시스템

### Manager 역할

- **GameManager**: 전체 게임 조율
- **StateManager**: 상태 관리
- **InputManager**: 입력 처리
- **UIManager**: UI 생성/관리
- **ScreenManager**: 화면 전환
- **CombatManager**: 전투 로직
- **DeckManager**: 덱 관리
- **CardManager**: 카드 시스템
- **RenderManager**: 렌더링
- **DebugManager**: 디버그 도구

### Manager 기본 구조

```javascript
class XxxManager extends ManagerCore {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
  }

  init() {
    // 초기화
  }

  registerEvents() {
    // 이벤트 구독
  }

  update(deltaTime) {
    // 매 프레임 업데이트
  }
}
```

## 이벤트 네이밍 규칙

### 이벤트 타입

- **ACTION**: 사용자 요청/명령
- **STATE**: 상태 변경 알림
- **QUERY**: 정보 조회 요청
- **RESPONSE**: 조회 응답
- **INPUT**: 사용자 입력
- **SCREEN**: 화면 전환
- **COMBAT**: 전투 관련

### 네이밍 패턴

```plaintext
{카테고리}:{대상}:{동작}
예: STATE:CHARACTER:CHANGED
```

## 장점

1. **낮은 결합도**: Manager 간 직접 참조 없음
2. **높은 확장성**: 새 Manager 추가 용이
3. **디버깅 용이**: 모든 이벤트 추적 가능
4. **테스트 용이**: 각 Manager 독립 테스트
5. **유지보수성**: 명확한 책임 분리
