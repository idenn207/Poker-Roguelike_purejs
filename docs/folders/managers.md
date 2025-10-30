# Managers 폴더

## 역할

각 게임 시스템을 독립적으로 관리하고 조율하는 Manager 클래스들의 집합입니다.

## 주요 기능

- 시스템별 비즈니스 로직 구현
- 이벤트 기반 통신으로 시스템 간 조율
- 상태 변경 요청 및 반응
- 게임 루프와의 연동 (`update` 메서드)

## 책임

- 각 시스템의 독립적 관리
- StateManager를 통한 상태 변경
- 이벤트 발행/구독으로 통신

## Manager 목록 및 역할

### GameManager

**역할**: 게임 전체 조율자

- 모든 Manager 인스턴스 생성 및 초기화
- Manager 간 초기화 순서 관리
- 게임 루프와 Manager 연결

### StateManager

**역할**: 중앙 상태 관리자

- GameState의 유일한 관리자
- ACTION 이벤트 수신 → 상태 변경 → STATE 이벤트 발행
- QUERY 이벤트에 대한 응답

### InputManager

**역할**: 사용자 입력 처리

- INPUT 이벤트 수신
- 입력을 ACTION 이벤트로 변환
- 버튼 클릭, 키보드 입력 처리

### UIManager

**역할**: UI 요소 생성 및 관리

- 화면별 UI 요소 동적 생성
- STATE 이벤트 수신하여 UI 업데이트
- DOM 이벤트를 INPUT 이벤트로 변환

### ScreenManager

**역할**: 화면 전환 관리

- 화면 표시/숨김 제어
- 전환 애니메이션 관리
- 자동 화면 전환 처리 (로고→로딩→메뉴)

### CombatManager

**역할**: 전투 시스템 관리

- 전투 시작/종료 관리
- 턴 순서 조율
- 데미지 계산 및 적용

### DeckManager

**역할**: 덱 시스템 관리

- 카드 드로우/버리기
- 덱 셔플 및 재편성
- 손패 관리

### CardManager

**역할**: 카드 시스템 관리

- 카드 능력 활성화
- 조건 체크
- 카드 상호작용 처리

### ShopManager

**역할**: 상점 시스템 관리

- 아이템 구매/판매
- 카드 강화 시스템
- 골드 거래 처리

### RewardManager

**역할**: 보상 시스템 관리

- 전투 보상 생성
- 보상 선택 처리
- 보상 분배

### RenderManager

**역할**: 렌더링 관리

- 디버그 패널 렌더링
- 게임 오브젝트 렌더링 (향후 확장)

### DebugManager

**역할**: 개발 도구 관리

- F1 키로 디버그 패널 토글
- 이벤트 로그 표시
- 게임 상태 모니터링

## Manager 기본 구조

```javascript
class XxxManager extends ManagerCore {
  constructor(eventBus) {
    super();
    this.eventBus = eventBus;
  }

  init() {
    // 초기화 로직
    // DOM 요소 생성, 초기 상태 설정
  }

  registerEvents() {
    // 이벤트 구독
    this.trackEventBusListener(this.eventBus, EVENTS.XXX, this.handleXxx.bind(this));
  }

  update(deltaTime) {
    // 매 프레임 업데이트 로직
    // 애니메이션, 상태 체크 등
  }
}
```

## 의존성

- **의존하는 것**: EventBus, ManagerCore, GameState (StateManager를 통해)
- **의존받는 것**: GameManager

## 설계 원칙

### 1. 독립성

- 각 Manager는 다른 Manager를 직접 참조하지 않음
- EventBus를 통해서만 통신

### 2. 단일 책임

- 각 Manager는 하나의 시스템만 관리
- 명확한 경계와 책임

### 3. 상태 불변성

- StateManager를 통해서만 GameState 변경
- 다른 Manager는 읽기 전용 접근

## 확장 가능성

- 새로운 Manager 추가가 용이
- 기존 시스템 수정 없이 새 기능 추가 가능
- 이벤트 기반으로 느슨한 결합 유지
