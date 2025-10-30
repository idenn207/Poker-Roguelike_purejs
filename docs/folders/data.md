# Data 폴더

## 역할

게임의 정적 데이터와 콘텐츠를 정의하는 데이터 파일들입니다.

## 주요 기능

- 카드 정의 데이터
- 캐릭터 스탯 데이터
- 덱 구성 데이터
- 적 정보 데이터

## 책임

- 게임 콘텐츠 데이터 제공
- 초기값 정의
- 밸런스 데이터 관리

## 데이터 구조

### cards.js

52장의 기본 카드를 정의합니다.

```javascript
const CARDS = {
  SPADE_ACE: {
    id: 'SPADE_ACE',
    suit: SUITS.SPADE,
    rank: RANKS.ACE,
    abilities: [],
    condition: CONDITION_TYPE.NONE,
  },
  // ... 52장 카드 정의
};
```

### character.js

플레이 가능한 캐릭터를 정의합니다.

```javascript
const CHARACTERS = {
  warrior: {
    id: 'warrior',
    name: '전사',
    description: '...',
    hp: 100,
    gold: 100,
    deck: 'warrior_deck',
    relics: [],
  },
  // ... 다른 캐릭터들
};
```

**캐릭터 타입:**

- **전사**: 체력 100, 골드 100
- **마법사**: 체력 80, 골드 80
- **도적**: 체력 90, 골드 150
- **사제**: 체력 85, 골드 120

### decks.js

덱 템플릿을 정의합니다.

```javascript
const DECKS = {
  standard: {
    id: 'standard_deck',
    name: '기본 덱',
    cards: [
      { id: 'SPADE_ACE', count: 1 },
      // ... 52장 카드 목록
    ],
  },
  warrior: {
    // 전사 전용 덱
  },
};
```

### enemies.js (미구현)

적 데이터를 정의할 예정입니다.

**계획된 구조:**

```javascript
const ENEMIES = {
    goblin: {
        id: 'goblin',
        name: '고블린',
        hp: 30,
        patterns: [...],
        rewards: {...}
    }
}
```

## 데이터 관리 원칙

### 1. 중앙화

- 모든 게임 데이터를 한 곳에서 관리
- 밸런스 조정이 용이

### 2. 불변성

- 런타임에 데이터 수정 금지
- 복사본을 생성하여 사용

### 3. 타입 안정성

- 일관된 데이터 구조 유지
- 필수 필드 정의

## 데이터 활용 플로우

```plaintext
Data 정의
    ↓
Factory에서 읽기
    ↓
Entity 객체 생성
    ↓
게임에서 사용
```

## 의존성

- **의존하는 것**: 게임 상수 (SUITS, RANKS 등)
- **의존받는 것**: Factory 클래스

## 데이터 확장 가이드

### 새 카드 추가

```javascript
// cards.js에 추가
JOKER_RED: {
    id: 'JOKER_RED',
    suit: SUITS.SPECIAL,
    rank: RANKS.JOKER,
    abilities: [...],
    condition: CONDITION_TYPE.NONE
}
```

### 새 캐릭터 추가

```javascript
// character.js에 추가
assassin: {
    id: 'assassin',
    name: '암살자',
    description: '치명타 특화',
    hp: 75,
    gold: 125,
    deck: 'assassin_deck',
    relics: ['poison_blade']
}
```

### 새 덱 추가

```javascript
// decks.js에 추가
assassin_deck: {
    id: 'assassin_deck',
    name: '암살자 덱',
    cards: [
        ...STANDARD_DECK.cards,
        // 특수 카드 추가
    ]
}
```

## 밸런싱 고려사항

- 캐릭터별 체력/골드 밸런스
- 카드 능력 파워 레벨
- 덱 구성의 시너지
- 보상 시스템 밸런스
