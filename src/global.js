// 서비스 개발에 유용한 전역 유틸 + CONSTANTS

// ---------- 이벤트 목록 정의 ---------- //
const EVENTS = {
  /** TYPE - 변경 상태 대상 목록 (관련 매니저) */
  TYPE: {
    STATE: 'state',
    INPUT: 'input',
    CARD: 'card',
    DECK: 'deck',
    STAGE: 'stage',
    COMBAT: 'combat',
    SHOP: 'shop',
    REWARD: 'reward',
    RENDER: 'render',
    UI: 'ui',
    SCREEN: 'screen',
  },

  /** DOM - 문서 객체 모델 관련 */
  DOM: {
    /** 클릭 */
    CLICK: 'click',

    /** 키 누름 */
    KEY_DOWN: 'keydown',

    /** 키 뗌 */
    KEY_UP: 'keyup',

    /** 키 입력 */
    KEY_PRESS: 'keypress',

    /** 강조 */
    FOCUS: 'focus',

    /** 입력 */
    INPUT: 'input',

    /** 변경 */
    CHANGE: 'change',

    /** 전환 종료 */
    TRANSITION_END: 'transitionend',
  },

  /** GAME - 게임 전체 생명주기 관리 */
  GAME: {
    /** 게임 초기화 완료 */
    INITIALIZED: 'game:initialized',

    /** 게임 시작 */
    STARTED: 'game:started',

    /** 게임 저장 불러오기 */
    LOAD: 'game:load',

    /** 게임 종료 */
    ENDED: 'game:ended',

    /** 게임 일시 정지 */
    PAUSED: 'game:paused',

    /** 게임 재개 */
    RESUMED: 'game:resumed',

    /** 게임 오버 */
    OVER: 'game:over',

    /** 게임 승리 */
    VICTORY: 'game:victory',

    /** 게임 저장 요청 */
    SAVE_REQUESTED: 'game:save_requested',

    /** 게임 로드 완료 */
    LOAD_COMPLETED: 'game:load_completed',
  },

  /** CHARACTER - 캐릭터 관련 */
  CHARACTER: {
    /** 캐릭터 선택 */
    SELECTED: 'character:selected',

    /** 캐릭터 해제 */
    CHANGED: 'character:changed',
  },

  /** COMBAT - 전투 시스템 */
  COMBAT: {
    /** 전투 시작 */
    STARTED: 'combat:started',

    /** 전투 종료 */
    ENDED: 'combat:ended',

    /** 턴 시작 */
    TURN_STARTED: 'combat:turn:started',

    /** 턴 종료 */
    TURN_ENDED: 'combat:turn:ended',

    /** 핸드 플레이 완료 */
    HAND_PLAYED: 'combat:hand:played',

    /** 핸드 평가 완료 */
    HAND_EVALUATED: 'combat:hand_evaluated',

    /** 피해량 계산 완료 */
    DAMAGE_CALCULATED: 'combat:damage_calculated',
  },

  /** PLAYER - 플레이어 상태 */
  PLAYER: {
    /** 플레이어 생성 */
    SPAWNED: 'player:spawned',

    /** 데미지 받음 */
    DAMAGED: 'player:damaged',

    /** 회복 */
    HEALED: 'player:healed',

    /** 보호막 획득 */
    SHIELD_GAINED: 'player:shield_gained',

    /** 보호막 잃음 */
    SHIELD_LOST: 'player:shield_lost',

    /** 골드 변화 */
    GOLD_CHANGED: 'player:gold_changed',

    /** 버프 획득 */
    BUFF_GAINED: 'player:buff_gained',

    /** 버프 잃음 */
    BUFF_LOST: 'player:buff_lost',

    /** 플레이어 사망 */
    DIED: 'player:died',
  },

  /** ENEMY - 적 상태 */
  ENEMY: {
    /** 적 생성 */
    SPAWNED: 'enemy:spawned',

    /** 데미지 맏음 */
    DAMAGED: 'enemy:damaged',

    /** 회복 */
    HEALED: 'enemy:healed',

    /** 보호막 획득 */
    SHIELD_GAINED: 'enemy:shield_gained',

    /** 보호막 잃음 */
    SHIELD_LOST: 'enemy:shield_lost',

    /** 버프 획득 */
    BUFF_GAINED: 'enemy:buff_gained',

    /** 버프 잃음 */
    BUFF_LOST: 'enemy:buff_lost',

    /** 적 사망 */
    DIED: 'enemy:died',
  },

  /** CARD - 카드 개별 동작 */
  CARD: {
    /** 카드 생성 */
    CREATED: 'card:created',

    /** 카드 뽑음 */
    DRAWN: 'card:drawn',

    /** 카드 사용 */
    PLAYED: 'card:played',

    /** 카드 버림 */
    DISCARDED: 'card:discarded',

    /** 카드 소멸 */
    EXHAUSTED: 'card:exhausted',

    /** 카드 업그레이드 */
    UPGRADED: 'card:upgraded',

    /** 카드 제거 */
    REMOVED: 'card:removed',

    /** 카드 선택 */
    SELECTED: 'card:selected',

    /** 카드 선택 해제 */
    DESELECTED: 'card:deselected',

    /** 카드 호버 */
    HOVERED: 'card:hovered',

    /** 카드 호버 해제 */
    HOVER_EXIT: 'card:hover_exit',

    /** 카드 능력 발동 */
    ABILITY_TRIGGERED: 'card:ability_triggered',

    /** 카드 조건 발동 */
    CONDITION_TRIGGERED: 'card:condition_triggered',
  },

  /** DECK - 덱 관리 */
  DECK: {
    /** 덱 초기화 */
    INITIALIZED: 'deck:initialized',

    /** 덱 셔플 */
    SHUFFLED: 'deck:shuffled',

    /** 덱 비움 */
    EMPTY: 'deck:empty',

    /** 덱 다시 섞기 (버림 타드 포함) */
    RESHUFFLED: 'deck:reshuffled',

    /** 덱 확인 */
    VIEWED: 'deck:viewed',

    /** 카드 추가 */
    CARD_ADDED: 'deck:card_added',

    /** 카드 제거 */
    CARD_REMOVED: 'deck:card_removed',
  },

  /** HAND - 핸드 관리 */
  HAND: {
    /** 핸드 초기화 */
    INITIALIZED: 'hand:initialized',

    /** 핸드 가득 참 */
    FULL: 'hand:full',

    /** 핸드 비어 있음 */
    EMPTY: 'hand:empty',

    /** 핸드 정렬 완료 */
    SORTED: 'hand:sorted',

    /** 핸드 크기 변경 */
    SIZE_CHANGED: 'hand:size_changed',
  },

  /** INPUT - 사용자 입력 */
  INPUT: {
    /** 카드 */
    CARD: {
      /** 카드 클릭 */
      CLICKED: 'input:card:clicked',

      /** 카드 드래그 시작 */
      DRAG_STARTED: 'input:card:drag_started',

      /** 카드 드래그 종료 */
      DRAG_ENDED: 'input:card:drag_ended',

      /** 카드 놓기 */
      DROPPED: 'input:card:dropped',
    },

    /** 버튼 */
    BUTTON: {
      /** 버튼 클릭 */
      CLICKED: 'input:button:clicked',
    },

    /** 턴 종료 */
    END_TURN: {
      /** 턴 종료 클릭 */
      CLICKED: 'input:end_turn_clicked',
    },

    /** 메뉴 */
    MENU: {
      /** 메뉴 열기 */
      OPENED: 'input:menu:opened',

      /** 메뉴 닫기 */
      CLOSED: 'input:menu:closed',
    },

    /** 확인 */
    CONFIRM: 'input:confirm',

    /** 취소 */
    CANCEL: 'input:cancel',

    /** 카드 호버 시작 */
    HOVER_STARTED: 'input:hover_started',

    /** 카드 호버 종료 */
    HOVER_ENDED: 'input:hover_ended',

    /** 키 입력 */
    KEY_PRESSED: 'input:key_pressed',
  },

  /** SCREEN - 화면 전황 */
  SCREEN: {
    /** 화면 변환 */
    CHANGED: 'screen:changed',

    /** 메뉴 화면 */
    MENU: 'screen:menu',

    /** 전투 화면 */
    COMBAT: 'screen:combat',

    /** 스테이지 선택 화면 */
    STAGE: 'screen:stage',

    /** 상점 화면 */
    SHOP: 'screen:shop',

    /** 보상 화면 */
    REWARD: 'screen:reward',

    /** 설정 화면 */
    SETTINGS: 'screen:settings',

    /** 카드 도감 화명 */
    CARD_LIBRARY: 'screen:card_library',

    /** 로딩 화면 */
    LOADING: 'screen:loading',

    /** 전체 덱 화면 */
    DECK: 'screen:deck',

    /** 뽑을 카드 더미 화면 */
    DRAW_PILE: 'screen:draw_pile',

    /** 버린 카드 더미 화면 */
    DISCARDED_PILE: 'screen:discarded_pile',

    /** 전환 */
    TRANSITION: {
      /** 전환 시작 */
      START: 'screen:transition:start',

      /** 전환 종료 */
      END: 'screen:transition:end',
    },
  },

  /** BUFF - 버프/디버프 시스템 */
  BUFF: {
    /** 버프 적용 */
    APPLIED: 'buff:applied',

    /** 버프 제거 */
    REMOVED: 'buff:removed',

    /** 버프 만료 */
    EXPIRED: 'buff:expired',

    /** 버프 중첩 */
    STACKED: 'buff:stacked',

    /** 버프 효과 발동 */
    TRIGGERED: 'buff:triggered',

    /** 버프 지속시간 변경 */
    DURATION_CHANGED: 'buff:duration_changed',

    // 특정 버프 타입
    /** 무효화 */
    NULLIFY: 'buff:nullify',

    /** 면역 */
    IMMUNITY: 'buff:immunity',

    /** 흡수(받은 피해 비례 방어 획득) */
    ABSORB: 'buff:absorb',

    /** 피해 감소 */
    DAMAGE_REDUCTION: 'buff:damage_reduction',

    /** 과다 치유 (최대 체력 증가) (임시) */
    OVERHEAL: 'buff:overheal',

    /** 임시 회복 (대출) */
    HEAL_LOAN: 'buff:heal_loan',

    /** 회복 불가 */
    HEAL_BLOCK: 'buff:heal_block',

    /** 공격 위력 증가 */
    POWER_BUFF: 'buff:power_buff',

    /** 방어 위력 증가 */
    BLOCK_BUFF: 'buff:block_buff',

    /** 지속 방어 */
    REGEN_BLOCK: 'buff:regen_block',

    /** 지속 회복 */
    REGEN: 'buff:regen',

    /** 반격 */
    COUNTER: 'buff:counter',

    /** 드로우 증가 */
    DRAW_BUFF: 'buff:draw_buff',

    /** 취약 */
    VULNERABLE: 'buff:vulnerable',

    /** 약화 */
    WEAKEN: 'buff:weaken',
  },

  /** UI - UI 업데이트 */
  UI: {
    /** 체력 바 업데이트 */
    HEALTH_BAR_UPDATE: 'ui:health_bar_update',

    /** 골드 표시 업데이트 */
    GOLD_DISPLAY_UPDATE: 'ui:gold_display_update',

    /** 툴팁 */
    TOOLTIP: {
      /** 툴팁 표시 */
      SHOW: 'ui:tooltip:show',

      /** 툴팁 숨기기 */
      HIDE: 'ui:tooltip:hide',
    },

    /** 알림 */
    NOTIFICATION: {
      /** 알림 표시 */
      SHOW: 'ui:notification:show',

      /** 알림 숨기기 */
      HIDE: 'ui:notification:hide',
    },

    /** 버튼 상태 변경 */
    BUTTON_STATE_CHANGED: 'ui:button_state_changed',

    /** 애니메이션 */
    ANIMATION: {
      /** 애니메이션 시작 */
      STARTED: 'ui:animation:started',

      /** 애니메이션 완료 */
      COMPLETED: 'ui:animation:completed',
    },
  },

  /** RENDER - 렌더링 관련 */
  RENDER: {
    /** 프레임 */
    FRAME: {
      /** 프레임 시작 */
      START: 'render:frame:start',

      /** 프레임 종료 */
      END: 'render:frame:end',
    },

    /** 이펙트 추가 */
    EFFECT_ADDED: 'render:effect_added',

    /** 이펙트 제거 */
    EFFECT_REMOVED: 'render:effect_removed',

    /** 파티클 생성 */
    PARTICLE_SPAWN: 'render:particle_spawn',

    /** 화면 흔들림 */
    SHAKE: {
      /** 화면 흔들림 시작 */
      START: 'render:shake:start',

      /** 화면 흔들림 종료 */
      END: 'render:shake:end',
    },

    /** 플래시 효과 */
    FLASH_EFFECT: 'render:flash_effect',

    /** 페이드 인 */
    FADE_IN: 'render:fade_in',

    /** 페이드 아웃 */
    FADE_OUT: 'render:fade_out',

    /** 카드 강조 */
    HIGHLIGHT_CARD: 'render:highlight_card',

    /** 발광 효과 */
    GLOW_EFFECT: 'render:glow_effect',

    /** 디버그 */
    DEBUG_PANEL: 'render:debug_panel',
  },

  /** SHOP - 상점 시스템 */
  SHOP: {
    /** 상점 열림 */
    OPENED: 'shop:opened',

    /** 상점 닫힘 */
    CLOSED: 'shop:closed',

    /** 아이템 선택 */
    ITEM_SELECTED: 'shop:item:selected',

    /** 아이템 구매 */
    ITEM_PURCHASED: 'shop:item:purchased',

    /** 아이템 판매완료 */
    ITEM_SOLD_OUT: 'shop:item:sold_out',

    /** 구매 실패 */
    PURCHASE_FAILED: 'shop:purchase_failed',

    /** 골드 부족 */
    INSUFFICIENT_GOLD: 'shop:insufficient_gold',

    /** 새로 고침 요청 */
    REFRESH_REQUESTED: 'shop:refresh_requested',

    /** 새로 고침 완료 */
    REFRESHED: 'shop:refreshed',

    /** 덱에서 카드 제거 */
    CARD_REMOVED_FROM_DECK: 'shop:card:removed_from_deck',
  },

  /** REWARD - 보상 시스템 */
  REWARD: {
    /** 보상 화면 */
    SCREEN: {
      /** 보상 화면 열림 */
      OPENED: 'reward:screen:opened',

      /** 보상 화면 닫힘 */
      CLOSED: 'reward:screen:closed',
    },
    /** 카드 획득 */
    CARD_EARNED: 'reward:card_earned',

    /** 골드 획득 */
    GOLD_EARNED: 'reward:gold_earned',

    /** 유물 획득 */
    RELIC_EARNED: 'reward:relic_earned',

    /** 포션 획득 */
    POTION_EARNED: 'reward:potion_earned',

    /** 보상 스킵 */
    SKIP_CONFIRMED: 'reward:skip_confirmed',
  },

  /** STAGE - 스테이지 관련 */
  STAGE: {
    /** 스테이지 시작 */
    STARTED: 'stage:started',

    /** 스테이지 완료 */
    COMPLETED: 'stage:completed',

    /** 스테이지 실패 */
    FAILED: 'stage:failed',

    /** 스테이지 진입 */
    ENTERED: 'stage:entered',

    /** 스테이지 퇴장 */
    EXITED: 'stage:exited',

    /** 보스 스테이지 */
    BOSS_STAGE: 'stage:boss_stage',

    /** 엘리트 스테이지 */
    ELITE_STAGE: 'stage:elite_stage',

    /** 휴식처 */
    REST_SITE: 'stage:rest_site',

    /** 보물방 */
    TREASURE_ROOM: 'stage:treasure_room',

    /** 이벤트 발생 */
    EVENT_TRIGGERED: 'stage:event_triggered',

    /** 경로 선택 */
    PATH_SELECTED: 'stage:path_selected',

    /** 층 변경 */
    FLOOR_CHANGED: 'stage:floor_changed',
  },

  /** QUERY - 조회 요청 */
  QUERY: {
    /** 게임 */
    GAME: {
      /** 게임 상태 조회 */
      STATE: 'query:game:state',
    },
    /** 캐릭터 */
    CHARACTER: {
      /** 캐릭터 상태 조회 */
      STATE: 'query:character:state',
    },

    /** 디버그 */
    DEBUG: {
      /** 디버그 상태 조회 */
      STATE: 'query:debug:state',
    },
  },

  /** RESPONSE - 조회 응답 */
  RESPONSE: {
    /** 게임 */
    GAME: {
      /** 게임 상태 조회 */
      STATE: 'response:game:state',
    },
    /** 캐릭터 */
    CHARACTER: {
      /** 캐릭터 상태 조회 */
      STATE: 'response:character:state',
    },

    /** 디버그 */
    DEBUG: {
      /** 디버그 상태 조회 */
      STATE: 'response:debug:state',
    },
  },

  /** STATE - 게임 상태 관리 */
  STATE: {
    /** 화면 상태 */
    SCREEN: {
      /** 화면 전환 완료 */
      CHANGED: 'state:screen:changed',
    },
    /** 캐릭터 상태 */
    CHARACTER: {
      /** 캐릭터 변경 완료 */
      CHANGED: 'state:character:changed',

      /** 캐릭터 선택 완료 */
      SELECTED: 'state:character:selected',
    },

    /** 게임 상태 */
    GAME: {
      /** 게임 시작 */
      STARTED: 'state:game:started',
    },

    /** 디버그 상태 */
    DEBUG: {
      /** 디버그 패널 토글 */
      TOGGLED: 'state:debug:toggled',

      /** 디버그 패널 탭 */
      TAB: {
        /** 디버그 패널 탭 변경 */
        CHANGED: 'state:debug:tab:changed',
      },

      /** 루프 정보 업데이트 */
      LOOP_UPDATED: 'state:debug:loop_updated',

      /** 이벤트 추가 */
      EVENT_ADDED: 'state:debug:event_added',
    },
  },

  /** ACTION - 사용자 행동 관련 (StateManager 에서 자원 관리) */
  ACTION: {
    /** 화면 */
    SCREEN: {
      /** 화면 전환 */
      CHANGE: 'action:screen:change',

      /** 화면 선택 */
      SELECT: 'action:screen:select',
    },
    /** 캐릭터 */
    CHARACTER: {
      /** 캐릭터 전환 */
      CHANGE: 'action:character:change',

      /** 캐릭터 선택 */
      SELECT: 'action:character:select',
    },
    /** 게임 */
    GAME: {
      /** 게임 시작 */
      START: 'action:game:start',
    },

    /** 디버그 */
    DEBUG: {
      /** 디버그 패널 토글 */
      TOGGLE: 'action:debug:toggle',

      /** 디버그 탭 변경 */
      CHANGE_TAB: 'action:debug:change_tab',
    },

    /** 루프 정보 업데이트 */
    UPDATE_LOOP_INFO: 'action:debug:update_loop_info',
  },

  /** 디버그 */
  DEBUG: {
    /** 디버그 이벤트 기록 */
    EVENT_LOGGED: 'action:debug:event_logged',
  },
};

// ---------- 카드 상수 정의 ---------- //
/** 모양 */
const SUITS = {
  SPADE: { symbol: '♠', color: 'black', name: 'spade' },
  DIAMOND: { symbol: '♦', color: 'red', name: 'diamond' },
  HEART: { symbol: '♥', color: 'red', name: 'heart' },
  CLUB: { symbol: '♣', color: 'black', name: 'club' },
};

/** 등급 */
const RANKS = {
  ACE: { value: 1, rank: 'A', order: 14 },
  TWO: { value: 2, rank: '2', order: 2 },
  THREE: { value: 3, rank: '3', order: 3 },
  FOUR: { value: 4, rank: '4', order: 4 },
  FIVE: { value: 5, rank: '5', order: 5 },
  SIX: { value: 6, rank: '6', order: 6 },
  SEVEN: { value: 7, rank: '7', order: 7 },
  EIGHT: { value: 8, rank: '8', order: 8 },
  NINE: { value: 9, rank: '9', order: 9 },
  TEN: { value: 10, rank: '10', order: 10 },
  JACK: { value: 11, rank: 'J', order: 11 },
  QUEEN: { value: 12, rank: 'Q', order: 12 },
  KING: { value: 13, rank: 'K', order: 13 },
};

// ---------- 능력 타입 정의 ---------- //
/** 능력 */
const ABILITY_TYPE = {
  // 공격
  /** 피해 증가 */
  DAMAGE_BONUS: 'damage_bonus',

  /** 방어 무시 */
  PIERCE: 'pierce',

  /** 범위 공격 */
  AREA_ATTACK: 'area_attack',

  /** 화상 공격 */
  BURN: 'burn',

  /** 생명력 흡수 */
  LIFESTEAL: 'lifesteal',

  /** 치명타 */
  CRITICAL: 'critical',

  /** 공격 위력 배율 적용 */
  POWER_MULTIPLY: 'power_multiply',

  /** 지연 피해 */
  DELAYED_DAMAGE: 'delayed_damage',

  /** 다회 공격 */
  MULTI_STRIKE: 'multi_strike',

  // 방어
  /** 획득 방어 증가 */
  SHIELD_BONUS: 'shield_bonus',

  /** 무효화 */
  NULLIFY: 'nullify',

  /** 면역 */
  IMMUNITY: 'immunity',

  /** 흡수(받은 피해 비례 방어 획득) */
  ABSORB: 'absorb',

  /** 피해 감소 */
  DAMAGE_REDUCTION: 'damage_reduction',

  // 회복
  /** 회복 */
  HEAL: 'heal',

  /** 과다 치유 (최대 체력 증가) (임시) */
  OVERHEAL: 'overheal',

  /** 임시 회복 (대출) */
  HEAL_LOAN: 'heal_loan',

  /** 상태 이상 제거 */
  CLEANSE: 'cleanse',

  // 유틸
  /** 회복 불가 */
  HEAL_BLOCK: 'heal_block',

  /** 카드 생성 */
  GENERATE_CARD: 'generate_card',

  /** 카드 교환 */
  EXCHANGE: 'exchange',

  /** 카드 뽑기 */
  DRAW: 'draw',

  /** 버리기 추가 */
  DISCARD: 'discard',

  /** 상대 카드 파괴 */
  DESTROY_CARD: 'destroy_card',

  // 버프
  /** 공격 위력 증가 */
  POWER_BUFF: 'power_buff',

  /** 방어 위력 증가 */
  BLOCK_BUFF: 'block_buff',

  /** 지속 방어 */
  REGEN_BLOCK: 'regen_block',

  /** 지속 회복 */
  REGEN: 'regen',

  /** 반격 */
  COUNTER: 'counter',

  /** 드로우 증가 */
  DRAW_BUFF: 'draw_buff',

  /** 취약 */
  VULNERABLE: 'vulnerable',

  /** 약화 */
  WEAKEN: 'weaken',
};

// ---------- 조건 타입 정의 ---------- //
/** 조건 */
const CONDITION_TYPE = {
  /** 없음 */
  NONE: 'none',

  /** 특정 족보 이상 */
  HAND_TYPE: 'hand_type',

  /** 같은 모양 n개 이상 플레이 */
  SAME_SUIT_COUNT: 'same_suit_count',

  /** 버렸을 때 */
  ON_DISCARD: 'on_discard',

  /** 이전에 플레이한 카드 중 */
  PREVIOUS_CARD: 'previous_card',

  /** 버린 카드 중 */
  DISCARDED_CARD: 'discarded_card',

  /** 버프 보유 */
  HAS_BUFF: 'has_buff',

  /** 일정체력 이하 */
  HEALTH_BELOW: 'health_below',

  /** 체력 소모 */
  HEALTH_COST: 'health_cost',
};

// ---------- 상태 정의 ---------- //
/** 화면 상태 */
const SCREEN_STATE_TYPE = {
  /** 로고 화면 */
  LOGO: 'logo',

  /** 로딩 화면 */
  LOADING: 'loading',

  /** 메뉴 화면 */
  MENU: 'menu',

  /** 캐릭터 선택 화면 */
  CHARACTER_SELECT: 'characterSelect',

  /** 일시 정지 화면 */
  PAUSE: 'pause',

  /** 설정 화면 */
  SETTING: 'setting',

  /** 스테이지 선택 화면 */
  STAGE: 'stage',

  /** 전투 화면 */
  BATTLE: 'battle',

  /** 보상 화면 */
  REWARD: 'reward',

  /** 게임 오버 화면 */
  GAMEOVER: 'gameover',
};
