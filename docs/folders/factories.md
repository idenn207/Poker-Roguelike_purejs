# Factories 폴더

## 역할

복잡한 객체 생성 로직을 캡슐화하는 팩토리 클래스들입니다.

## 주요 기능

- 엔티티 객체 생성
- 생성 로직 중앙화
- 데이터 기반 객체 생성

## 책임

- 올바른 초기 상태의 객체 생성
- 생성 매개변수 검증
- 복잡한 생성 과정 관리

## 클래스 구조

### CardFactory

카드 객체를 생성하는 정적 팩토리 클래스입니다.

**주요 메서드:**

```javascript
// 매개변수 기반 카드 생성
static createCard(suit, rank, abilities, condition)

// ID 기반 카드 생성
static createCardById(cardId)

// 랜덤 특수 카드 생성
static createRandomSpecialCard(rarity)
```

**생성 프로세스:**

1. 카드 기본 정보 설정 (suit, rank)
2. 능력 인스턴스 생성 (CardAbility)
3. 조건 인스턴스 생성 (CardAbilityCondition)
4. Card 객체 생성 및 반환

**특수 기능:**

- 희귀도별 능력 개수 결정
- 랜덤 능력 생성
- 카드 정의 데이터 조회

### DeckFactory

덱 객체를 생성하는 정적 팩토리 클래스입니다.

**주요 메서드:**

```javascript
// ID 기반 덱 생성
static createDeckById(deckId)
```

**생성 프로세스:**

1. 덱 정의 데이터 조회
2. 각 카드 생성 (CardFactory 사용)
3. Deck 객체 생성 및 카드 추가
4. 초기화된 덱 반환

### PlayerFactory (미구현)

플레이어 객체 생성 예정

### EnemyFactory (미구현)

적 객체 생성 예정

## 팩토리 패턴의 장점

### 1. 생성 로직 중앙화

- 객체 생성 코드 중복 제거
- 일관된 생성 프로세스

### 2. 복잡성 은닉

- 복잡한 초기화 과정 캡슐화
- 클라이언트 코드 단순화

### 3. 유연성

- 생성 로직 변경이 용이
- 새로운 생성 방식 추가 가능

## 데이터 흐름

```plaintext
데이터 정의 (data/*.js)
    ↓
Factory 메서드 호출
    ↓
데이터 검증 및 변환
    ↓
Entity 생성
    ↓
초기화된 객체 반환
```

## 의존성

- **의존하는 것**: Entity 클래스, 데이터 정의
- **의존받는 것**: Manager, 게임 로직

## 사용 예시

### 카드 생성

```javascript
// ID로 카드 생성
const card = CardFactory.createCardById('SPADE_ACE');

// 랜덤 레어 카드 생성
const rareCard = CardFactory.createRandomSpecialCard('rare');
```

### 덱 생성

```javascript
// 전사 덱 생성
const warriorDeck = DeckFactory.createDeckById('warrior_deck');
```

## 확장 가능성

- 새로운 Factory 클래스 추가 용이
- 생성 전략 패턴 적용 가능
- 추상 팩토리 패턴으로 확장 가능
