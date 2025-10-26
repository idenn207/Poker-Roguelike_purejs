# EventFlowDiagram

```plaintext
┌─────────────────────────────────────────────────────────────┐
│                         EventBus                            │
│                      (중앙 통신 허브)                         │
└─────────────────────────────────────────────────────────────┘
         ↑                    ↑                   ↑
         │                    │                   │
    emit │              emit  │             emit  │
         │                    │                   │
┌────────┴────────┐  ┌────────┴────────┐  ┌───────┴─────────┐
│  InputManager   │  │  StateManager   │  │   UIManager     │
│                 │  │                 │  │                 │
│ - 입력 감지      │  │ - GameState     │  │ - UI 렌더링      │
│ - 액션 요청      │  │ - 상태 변경      │  │ - 이벤트 수신     │
│   발행          │  │ - 상태 정보      │  │                 │
│                 │  │   발행          │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
         │                    │                    │
         │  action:xxx        │  state:xxx         │
         └────────────────────┼────────────────────┘
                              │
                        EventBus
```

## 📊 이벤트 흐름 다이어그램

```plaintext
사용자 입력
    ↓
InputManager (버튼 클릭 감지)
    ↓ emit('action:xxx')
StateManager (GameState 수정)
    ↓ emit('state:xxx')
UIManager/ScreenManager (UI 업데이트)
```

### 예시: 캐릭터 변경 흐름

```plaintext
1. 사용자가 "다음 캐릭터" 버튼 클릭
   ↓
2. UIManager
   → emit('INPUT.BUTTON_CLICKED', {button: 'next-character'})
   ↓
3. InputManager (구독: INPUT.BUTTON_CLICKED)
   → emit('action:change-character', {direction: 'next'})
   ↓
4. StateManager (구독: action:change-character)
   → GameState.currentCharacterIndex 변경
   → emit('state:character-changed', {
       currentCharacter: {...},
       prevCharacter: {...},
       nextCharacter: {...},
       currentIndex: 1,
       allCharacters: [...]
     })
   ↓
5. UIManager (구독: state:character-changed)
   → updateCharacterInfo(data.currentCharacter)
   → updateCharacterCards(data.prevCharacter, data.currentCharacter, data.nextCharacter)
```
