# Core 폴더

## 역할

게임의 핵심 엔진 기능을 제공하는 기반 시스템입니다.

## 주요 기능

- 이벤트 기반 통신 시스템 (EventBus)
- DOM 조작 헬퍼 유틸리티 (DrawHelper)
- Manager 기본 클래스 제공 (ManagerCore)

## 책임

- 모든 Manager가 상속받는 기본 기능 제공
- 시스템 간 통신 인프라 구축
- DOM 조작 추상화

## 클래스 구조

### EventBus

중앙 이벤트 허브로 모든 통신을 중재합니다.

**주요 메서드:**

- `on(eventName, handler)`: 이벤트 구독
- `once(eventName, handler)`: 일회성 구독
- `off(eventName, listenerId)`: 구독 해제
- `emit(eventName, data)`: 이벤트 발행

**특징:**

- 이벤트 히스토리 추적 (디버깅용)
- 리스너 ID 기반 관리
- 순환 참조 방지

### DrawHelper

DOM 조작을 위한 정적 헬퍼 클래스입니다.

**주요 기능:**

- 요소 생성/조회/수정
- 스타일 및 클래스 조작
- 이벤트 리스너 관리
- 데이터셋 관리

**사용 예시:**

```javascript
const element = DrawHelper.createElement('div', 'my-class');
DrawHelper.setText(element, 'Hello');
DrawHelper.appendChild(parent, element);
```

### ManagerCore

모든 Manager의 기본 클래스입니다.

**제공 기능:**

- DrawHelper 접근 (`this.draw`)
- EventCleanup 믹스인 상속
- 생명주기 메서드 (`init`, `registerEvents`, `update`, `destroy`)

## 의존성

- **의존하는 것**: 없음 (최하위 레이어)
- **의존받는 것**: 모든 Manager 클래스

## 설계 원칙

1. **단일 책임**: 각 클래스는 하나의 명확한 책임
2. **의존성 역전**: Manager들이 Core에 의존, Core는 독립적
3. **개방-폐쇄**: 확장에는 열려있고 수정에는 닫혀있음

## 확장 가능성

- 새로운 이벤트 타입 추가 용이
- DrawHelper에 새로운 DOM 조작 메서드 추가 가능
- ManagerCore에 공통 기능 추가 시 모든 Manager가 혜택
