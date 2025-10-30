# Utils 폴더

## 역할

게임 전반에서 사용되는 공통 유틸리티 함수와 헬퍼 클래스를 제공합니다.

## 주요 기능

- 문자열 처리 유틸리티
- 랜덤 함수
- 믹스인 패턴 구현
- 콘솔 오버라이드

## 책임

- 재사용 가능한 공통 기능 제공
- 크로스커팅 관심사 처리
- 개발 도구 지원

## 파일 구조

### console-override.js

콘솔 메서드를 오버라이드하여 호출자 정보를 추가합니다.

**기능:**

- 호출 위치 (파일:라인) 표시
- 클래스명, 메서드명 표시
- 상대 경로 변환

**사용 예시:**

```javascript
console.log('Hello');
// 출력: [ClassName.methodName (file.js:10)] Hello
```

### string.js

문자열 처리 유틸리티 함수들입니다.

**함수:**

```javascript
// JSON을 컴팩트한 문자열로 변환
json2stringCompact(json);
```

### random.js

무작위 관련 유틸리티 함수들입니다.

**함수:**

```javascript
// 배열 셔플 (Fisher-Yates)
shuffleArray(array, (inPlace = true));

// 랜덤 요소 선택
randomElement(array);

// 범위 내 랜덤 정수
randomInt(min, max);
```

### mixin.js

다중 상속을 구현하는 믹스인 헬퍼입니다.

**함수:**

```javascript
// 믹스인 적용
applyMixins(targetClass, ...mixins);
```

## Mixin 시스템

### EventCleanup 믹스인

이벤트 리스너 자동 정리 기능을 제공합니다.

**제공 메서드:**

```javascript
// EventBus 이벤트 추적
trackEventBusListener(eventBus, eventName, handler);

// DOM 이벤트 추적
trackDomListener(element, eventType, handler);

// 모든 이벤트 정리
cleanupEventListeners();

// 특정 타입만 정리
cleanupListenersByType(eventType);
```

**사용 예시:**

```javascript
class MyManager extends ManagerCore {
  registerEvents() {
    // 자동 추적 및 정리
    this.trackEventBusListener(this.eventBus, EVENT_NAME, this.handler.bind(this));
  }

  destroy() {
    // 모든 이벤트 자동 정리
    this.cleanupEventListeners();
  }
}
```

## 유틸리티 설계 원칙

### 1. 순수 함수

- 부작용 없음
- 입력에 대해 항상 같은 출력
- 테스트 용이

### 2. 범용성

- 특정 도메인에 종속되지 않음
- 여러 곳에서 재사용 가능

### 3. 단일 책임

- 각 함수는 하나의 명확한 기능
- 조합하여 복잡한 기능 구현

## 의존성

- **의존하는 것**: 없음 (최하위 레이어)
- **의존받는 것**: 모든 시스템

## 확장 가이드

### 새 유틸리티 추가

1. 적절한 파일 선택 또는 생성
2. 순수 함수로 구현
3. JSDoc 주석 추가
4. 테스트 작성

### 예시: 배열 유틸리티

```javascript
// utils/array.js
/**
 * 배열을 청크로 분할
 * @param {Array} array - 원본 배열
 * @param {number} size - 청크 크기
 * @returns {Array[]} 분할된 배열
 */
function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
```

### 새 믹스인 추가

```javascript
// utils/mixin/Observable.js
class Observable {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  notify(data) {
    this.observers.forEach((o) => o.update(data));
  }
}
```

## 성능 고려사항

- 자주 호출되는 함수는 최적화
- 메모이제이션 적용 고려
- 불필요한 객체 생성 피하기

## 디버깅 지원

- console-override로 호출 추적
- 명확한 에러 메시지
- 타입 체크 및 검증
