# Poker Roguelike

트럼프 카드 기반의 로그라이크 게임입니다. 포커 족보를 활용한 전투 시스템과 카드 능력 강화 시스템을 특징으로 합니다.

## 🎮 게임 개요

- **장르**: 로그라이크 카드 게임
- **플랫폼**: 웹 브라우저
- **기술 스택**: Vanilla JavaScript, HTML5, CSS3
- **아키텍처**: Event-Driven Architecture (EventBus 기반)

## 📋 목차

- [게임 시스템](./docs/game-systems.md)
- [프로젝트 구조](./docs/project-structure.md)
- [아키텍처](./docs/architecture.md)
- [이벤트 시스템](./docs/event-system.md)
- [클래스 다이어그램](./docs/class-diagram.md)

## 🎯 주요 특징

### 카드 시스템

- 52장의 기본 트럼프 카드
- 카드당 최대 5개의 능력 부여 가능
- 조건부 능력 발동 시스템

### 전투 시스템

- 포커 족보 기반 데미지 계산
- 턴제 전투
- 10장 드로우, 5장 플레이 메커니즘

### 진행 시스템

- 3개 메인 스테이지 × 5개 서브 스테이지
- 상점, 휴식, 보물, 이벤트 노드
- 전투 보상 및 카드 강화

## 🚀 시작하기

```bash
# 로컬 서버 실행 (예: Live Server)
# index.html 파일을 브라우저에서 직접 열기
```

## 🎮 조작 방법

- **F1**: 디버그 패널 토글
- **마우스 클릭**: 카드 선택, 버튼 상호작용
- **드래그**: 디버그 패널 이동

## 📁 주요 디렉토리

```
/src
├── /core          # 핵심 엔진 (EventBus, DrawHelper)
├── /managers      # 게임 매니저 (State, Combat, UI 등)
├── /state         # 전역 상태 관리
├── /entities      # 게임 객체 (Card, Deck, Player)
├── /factories     # 팩토리 패턴 구현
└── GameLoop.js    # 메인 게임 루프
```

자세한 내용은 [프로젝트 구조 문서](./docs/project-structure.md)를 참조하세요.

## 🏗️ 아키텍처

이벤트 기반 아키텍처를 채택하여 모듈 간 낮은 결합도와 높은 독립성을 유지합니다.

- **EventBus**: 중앙 통신 허브
- **StateManager**: 중앙 상태 관리
- **Manager Pattern**: 각 시스템별 독립적 관리

자세한 내용은 [아키텍처 문서](./docs/architecture.md)를 참조하세요.
