# UI 폴더

## 역할

사용자 인터페이스 컴포넌트를 관리하는 UI 요소들입니다.

## 주요 기능

- 화면별 UI 컴포넌트
- HUD (Heads-Up Display) 요소
- 메뉴 시스템
- 대화상자 및 패널

## 책임

- 사용자 입력 수신
- 정보 표시
- 상호작용 가능한 요소 관리

## 폴더 구조

```plaintext
/ui
├── /hud          # 게임 중 항시 표시 UI
│   ├── HealthBar.js
│   └── Stage.js
├── /menus        # 메뉴 화면
│   ├── MainMenu.js
│   ├── PauseMenu.js
│   └── GameOverMenu.js
└── /panels       # 팝업 패널
    └── DebugPanel.js
```

## UI vs Render 구분 기준

### UI 폴더에 포함

✅ 클릭/터치 가능한 요소
✅ 버튼, 입력 필드
✅ 화면 고정 요소 (HUD)
✅ 메뉴, 설정 화면
✅ 정보 패널, 툴팁

### Render 폴더에 포함

❌ 게임 오브젝트 (캐릭터, 카드)
❌ 배경, 이펙트
❌ 파티클, 애니메이션
❌ 게임 월드 요소

## UI 컴포넌트 타입

### HUD 요소

게임 진행 중 항상 표시되는 UI입니다.

#### **HealthBar.js**

- 플레이어 체력 표시
- 적 체력 표시
- 보호막 표시

#### **Stage.js**

- 현재 스테이지 정보
- 진행도 표시

### 메뉴 시스템

게임 흐름을 제어하는 메뉴들입니다.

#### **MainMenu.js**

- 새 게임
- 계속하기
- 설정
- 종료

#### **PauseMenu.js**

- 일시정지 메뉴
- 설정 접근
- 메인 메뉴로

#### **GameOverMenu.js**

- 게임 오버 화면
- 점수 표시
- 재시작/메인 메뉴

### 패널 시스템

오버레이 형태의 UI 패널들입니다.

#### **DebugPanel.js**

- 이벤트 로그
- 게임 상태
- 성능 모니터

## UI 생성 패턴

### 동적 생성

UIManager가 필요시 동적으로 생성합니다.

```javascript
// UIManager.js
createMenuScreen() {
    const screen = this.draw.createElement('div', 'screen');
    // ... UI 요소 생성
    document.body.appendChild(screen);
}
```

### 이벤트 바인딩

```javascript
// 버튼 클릭 이벤트
button.addEventListener('click', () => {
  this.eventBus.emit(EVENTS.INPUT.BUTTON.CLICKED, {
    button: 'button-id',
  });
});
```

## UI 업데이트 플로우

```plaintext
STATE 이벤트 수신
    ↓
UIManager에서 처리
    ↓
해당 UI 컴포넌트 업데이트
    ↓
DOM 수정
```

## 의존성

- **의존하는 것**: DrawHelper, EventBus
- **의존받는 것**: UIManager

## CSS 스타일링

UI 요소들은 CSS 파일과 연동됩니다.

- `/css/screens.css`: 화면 레이아웃
- `/css/cards.css`: 카드 UI 스타일
- `/css/animations.css`: UI 애니메이션

## 확장 가능성

### 새 UI 컴포넌트 추가

1. `/ui` 폴더에 새 파일 생성
2. UIManager에서 생성 메서드 추가
3. 이벤트 핸들러 등록
4. CSS 스타일 추가

### 예시: 인벤토리 UI

```javascript
// ui/panels/Inventory.js
class Inventory {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  create() {
    // UI 생성 로직
  }

  update(items) {
    // 아이템 목록 업데이트
  }
}
```

## 접근성 고려사항

- 키보드 네비게이션
- 화면 리더 지원
- 고대비 모드
- 반응형 레이아웃
