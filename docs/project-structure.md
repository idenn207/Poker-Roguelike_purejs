# 프로젝트 구조

## 디렉토리 구조

```plaintext
/src
├── /assets         # 게임 리소스
├── /components     # 재사용 가능한 게임 컴포넌트
├── /config         # 게임 설정
├── /core           # 핵심 엔진
├── /data           # 게임 데이터
├── /entities       # 게임 객체
├── /factories      # 객체 생성 팩토리
├── /logic          # 순수 게임 로직
├── /managers       # 시스템 매니저
├── /render         # 렌더링 시스템
├── /state          # 상태 관리
├── /ui             # UI 컴포넌트
├── /utils          # 유틸리티 함수
├── GameLoop.js     # 메인 게임 루프
├── main.js         # 애플리케이션 진입점
└── index.js        # 스크립트 로더
```

## 각 폴더별 상세 설명

### [/core](./folders/core.md)

- **역할**: 게임의 핵심 엔진 기능 제공
- **주요 클래스**: EventBus, DrawHelper, ManagerCore
- **책임**: 이벤트 시스템, DOM 조작, 매니저 기본 클래스

### [/managers](./folders/managers.md)

- **역할**: 각 게임 시스템의 조율 및 관리
- **주요 클래스**: GameManager, StateManager, CombatManager 등
- **책임**: 시스템 간 통신, 상태 변경, 로직 실행

### [/state](./folders/state.md)

- **역할**: 전역 게임 상태 데이터 저장
- **주요 클래스**: GameState, DebugState
- **책임**: 상태 데이터 관리 (로직 없음)

### [/entities](./folders/entities.md)

- **역할**: 게임 객체 정의
- **주요 클래스**: Card, Deck, Player, Enemy
- **책임**: 게임 객체의 속성과 기본 동작

### [/factories](./folders/factories.md)

- **역할**: 객체 생성 로직 캡슐화
- **주요 클래스**: CardFactory, DeckFactory
- **책임**: 복잡한 객체 생성 과정 관리

### [/components](./folders/components.md)

- **역할**: 재사용 가능한 게임 컴포넌트
- **주요 클래스**: CardAbility, CardAbilityCondition
- **책임**: 카드 능력 시스템 구현

### [/ui](./folders/ui.md)

- **역할**: 사용자 인터페이스 요소
- **주요 컴포넌트**: 메뉴, HUD, 패널
- **책임**: UI 렌더링 및 사용자 입력 처리

### [/render](./folders/render.md)

- **역할**: 게임 객체 렌더링
- **주요 클래스**: DebugRenderer
- **책임**: 시각적 표현 (현재 CSS 기반)

### [/data](./folders/data.md)

- **역할**: 정적 게임 데이터
- **내용**: 카드 정의, 캐릭터 스탯, 덱 구성
- **책임**: 게임 콘텐츠 데이터 제공

### [/utils](./folders/utils.md)

- **역할**: 공통 유틸리티 함수
- **내용**: 랜덤, 문자열, 믹스인 등
- **책임**: 재사용 가능한 헬퍼 함수 제공

## 의존성 관계

```plaintext
index.js (진입점)
    ↓
main.js
    ↓
GameLoop.js
    ↓
GameManager
    ↓
각 Manager들 (병렬)
    ↓
EventBus (중앙 통신)
```

## 로드 순서

1. global.js (전역 상수)
2. config (설정)
3. utils (유틸리티)
4. state (상태 정의)
5. data (데이터)
6. core (핵심 엔진)
7. components (컴포넌트)
8. entities (엔티티)
9. factories (팩토리)
10. logic (로직)
11. managers (매니저)
12. render (렌더)
13. ui (UI)
14. assets (리소스)
15. GameLoop (게임 루프)
16. main.js (초기화)
