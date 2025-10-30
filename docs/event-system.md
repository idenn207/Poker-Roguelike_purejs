# 이벤트 시스템

## EventBus 구조

EventBus는 게임의 중앙 통신 허브로, 발행-구독 패턴을 구현합니다.

### 주요 메서드

```javascript
// 이벤트 구독
eventBus.on(eventName, handler);

// 일회성 구독
eventBus.once(eventName, handler);

// 구독 해제
eventBus.off(eventName, listenerId);

// 이벤트 발행
eventBus.emit(eventName, data);
```

## 이벤트 카테고리

### ACTION 이벤트

사용자의 의도나 시스템 요청을 나타냅니다.

```javascript
// 화면 전환 요청
ACTION.SCREEN.CHANGE;
// 캐릭터 변경 요청
ACTION.CHARACTER.CHANGE;
// 게임 시작 요청
ACTION.GAME.START;
```

### STATE 이벤트

상태 변경 완료를 알립니다.

```javascript
// 화면 전환 완료
STATE.SCREEN.CHANGED;
// 캐릭터 변경 완료
STATE.CHARACTER.CHANGED;
// 게임 시작 완료
STATE.GAME.STARTED;
```

### QUERY/RESPONSE 이벤트

정보 조회 요청과 응답입니다.

```javascript
// 게임 상태 조회
QUERY.GAME.STATE → RESPONSE.GAME.STATE
// 캐릭터 정보 조회
QUERY.CHARACTER.STATE → RESPONSE.CHARACTER.STATE
```

## 이벤트 플로우 예시

### 캐릭터 변경 플로우

```plaintext
1. 사용자가 "다음 캐릭터" 버튼 클릭
   ↓
2. UIManager
   → emit('INPUT.BUTTON.CLICKED', {button: 'next-character'})
   ↓
3. InputManager (구독: INPUT.BUTTON.CLICKED)
   → emit('ACTION.CHARACTER.CHANGE', {direction: 'next'})
   ↓
4. StateManager (구독: ACTION.CHARACTER.CHANGE)
   → GameState.currentCharacterIndex 변경
   → emit('STATE.CHARACTER.CHANGED', {
       currentCharacter: {...},
       prevCharacter: {...},
       nextCharacter: {...}
     })
   ↓
5. UIManager (구독: STATE.CHARACTER.CHANGED)
   → updateCharacterInfo(data.currentCharacter)
   → updateCharacterCards(...)
```

### 전투 시작 플로우

```plaintext
1. 스테이지에서 몬스터 노드 선택
   ↓
2. StageManager
   → emit('ACTION.COMBAT.START', {stageType: 'monster'})
   ↓
3. StateManager
   → 전투 상태 초기화
   → emit('STATE.COMBAT.STARTED')
   ↓
4. CombatManager
   → 몬스터 생성
   → 전투 UI 초기화
   ↓
5. DeckManager
   → 덱 셔플
   → emit('DECK.SHUFFLED')
   ↓
6. 초기 핸드 드로우
   → emit('CARD.DRAWN')
```

## 이벤트 로깅 시스템

### 자동 로깅

모든 이벤트는 자동으로 로그됩니다.

```javascript
// 로그 엔트리 구조
{
    timestamp: 1234567890,
    time: "14:30:25.123",
    eventName: "STATE.CHARACTER.CHANGED",
    data: {...},
    listenerCount: 3
}
```

### 디버그 패널

F1 키로 디버그 패널을 열어 실시간 이벤트 모니터링이 가능합니다.

## 이벤트 정리 (Cleanup)

### EventCleanup 믹스인

모든 Manager는 EventCleanup 믹스인을 통해 자동 이벤트 정리를 지원합니다.

```javascript
// 이벤트 등록 시 자동 추적
this.trackEventBusListener(eventBus, eventName, handler);
this.trackDomListener(element, eventType, handler);

// 모든 이벤트 정리
this.cleanupEventListeners();
```

## 모범 사례

### 1. 명확한 네이밍

```javascript
// Good
EVENTS.STATE.CHARACTER.CHANGED;

// Bad
EVENTS.CHAR_UPDATE;
```

### 2. 데이터 구조 일관성

```javascript
// 항상 객체로 전달
eventBus.emit(EVENT_NAME, {
  key1: value1,
  key2: value2,
});
```

### 3. 에러 처리

```javascript
try {
  eventBus.emit(EVENT_NAME, data);
} catch (error) {
  console.error('Event emission failed:', error);
}
```

### 4. 순환 참조 방지

```javascript
// STATE 이벤트에서 ACTION 이벤트 발행 금지
// ACTION → STATE (O)
// STATE → ACTION (X)
```
