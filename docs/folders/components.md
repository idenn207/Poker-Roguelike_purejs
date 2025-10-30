# Components 폴더

## 역할

재사용 가능한 게임 컴포넌트를 정의하는 클래스들입니다.

## 주요 기능

- 카드 능력 시스템 구현
- 조건부 활성화 로직
- 능력과 조건의 조합

## 책임

- 능력 효과 정의
- 조건 체크 로직
- 설명 텍스트 생성

## 클래스 구조

### CardAbility

카드에 부여되는 개별 능력을 정의합니다.

**주요 속성:**

- `type`: 능력 타입 (ABILITY_TYPE enum)
- `value`: 능력 수치
- `condition`: 발동 조건
- `id`: 고유 식별자

**주요 메서드:**

- `canActivate(context)`: 능력 발동 가능 여부 체크
- `getDescription()`: 능력 설명 텍스트 생성
- `getAbilityText()`: 능력 효과 텍스트

**능력 카테고리:**

1. **공격계**: 데미지 증가, 방어 무시, 범위 공격 등
2. **방어계**: 방어 획득, 무효화, 면역 등
3. **회복계**: 체력 회복, 과다 치유, 상태이상 제거
4. **유틸계**: 카드 조작, 버프/디버프 부여
5. **버프계**: 지속 효과, 능력 강화

### CardAbilityCondition

능력 발동 조건을 정의합니다.

**주요 속성:**

- `type`: 조건 타입 (CONDITION_TYPE enum)
- `params`: 조건 매개변수

**주요 메서드:**

- `check(context)`: 조건 충족 여부 확인
- `checkSameSuitCount(context)`: 같은 모양 개수 체크
- `getDescription()`: 조건 설명 텍스트

**조건 타입:**

```javascript
CONDITION_TYPE = {
  NONE: 'none', // 조건 없음
  HAND_TYPE: 'hand_type', // 특정 족보 이상
  SAME_SUIT_COUNT: 'same_suit_count', // 같은 모양 n개
  ON_DISCARD: 'on_discard', // 버렸을 때
  HEALTH_BELOW: 'health_below', // 체력 조건
  HAS_BUFF: 'has_buff', // 버프 보유
};
```

## 시스템 설계

### 능력-조건 관계

```plaintext
Card (1) ─── (0..5) CardAbility
 │                      │
 └─── (1) CardAbilityCondition
```

### 능력 발동 플로우

```plaintext
카드 플레이/버리기
    ↓
Context 생성 (게임 상태)
    ↓
각 능력의 canActivate() 체크
    ↓
조건 충족된 능력들 수집
    ↓
능력 효과 적용
```

### Context 구조

```javascript
context = {
    action: 'play' | 'discard',
    handType: HandType,
    playedCards: Card[],
    playerHealth: number,
    buffs: Map,
    // ... 기타 게임 상태
}
```

## 설계 원칙

### 1. 조합 가능성

- 능력과 조건을 자유롭게 조합
- 최대 5개 능력으로 다양한 전략 구성

### 2. 확장성

- 새로운 능력 타입 추가 용이
- 새로운 조건 타입 추가 용이

### 3. 명확한 분리

- 능력 효과와 발동 조건 분리
- 각각 독립적으로 관리

## 의존성

- **의존하는 것**: 게임 상수 (ABILITY_TYPE, CONDITION_TYPE)
- **의존받는 것**: Card, CardFactory

## 확장 예시

### 새로운 능력 추가

```javascript
// ABILITY_TYPE에 추가
POISON: 'poison'  // 독 데미지

// CardAbility.getAbilityText()에 추가
[ABILITY_TYPE.POISON]: `독 +${this.value}`
```

### 새로운 조건 추가

```javascript
// CONDITION_TYPE에 추가
COMBO_COUNT: 'combo_count'  // 콤보 횟수

// CardAbilityCondition.check()에 추가
case CONDITION_TYPE.COMBO_COUNT:
    return context.comboCount >= this.params.count;
```

## 게임플레이 영향

- 전략적 깊이 증가: 조건을 만족시키기 위한 플레이
- 리스크-리워드: 강력한 능력일수록 까다로운 조건
- 덱 빌딩: 시너지를 고려한 카드 선택
