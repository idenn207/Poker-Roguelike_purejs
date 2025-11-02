/**
 * 파일위치: /src/managers/UIManager.js (추가할 메서드)
 * 파일명: UIManager_ShopScreen.js
 * 용도: 상점 화면 HTML 생성
 * 기능: 카지노 테마 상점 UI 구조
 * 책임: 상점 화면 DOM 생성
 */

class ShopScreen extends UICore {
  /**
   * @param {EventBus} eventBus
   */
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;
  }
  /**
   * 상점 화면 UI 생성
   */
  createShopScreen() {
    const screen = this._draw.createElement("div", "screen");
    this._draw.setId(screen, "shopScreen");

    // 메인 컨테이너
    const container = this._draw.createElement("div", "shop-container");

    // ========================================
    // 헤더 (플레이어 정보 + 타이틀 + x 버튼)
    // ========================================
    const header = this._draw.createElement("div", "shop-header");

    // 좌측: 플레이어 정보
    const playerInfo = this._draw.createElement("div", "shop-player-info");
    this._draw.setId(playerInfo, "shopPlayerInfo");

    const playerAvatar = this._draw.createElement("div", "shop-player-avatar");
    this._draw.setText(playerAvatar, "👤");

    const playerStats = this._draw.createElement("div", "shop-player-stats");

    const hpStat = this._draw.createElement("div", "shop-stat-item");
    this._draw.setHTML(hpStat, '<span class="shop-stat-label">HP</span><span class="shop-stat-value" id="shopPlayerHp">100/100</span>');

    const goldStat = this._draw.createElement("div", "shop-stat-item gold");
    this._draw.setHTML(goldStat, '<span class="shop-stat-label">💰</span><span class="shop-stat-value" id="shopPlayerGold">250</span>');

    this._draw.appendChild(playerStats, hpStat);
    this._draw.appendChild(playerStats, goldStat);
    this._draw.appendChild(playerInfo, playerAvatar);
    this._draw.appendChild(playerInfo, playerStats);

    // 중앙: 타이틀
    const title = this._draw.createElement("div", "shop-title");
    this._draw.setText(title, "카지노 상점");

    // 우측: X 버튼
    const closeBtn = this._draw.createElement("button", "shop-close-btn");
    this._draw.setText(closeBtn, "✕");
    this._draw.setId(closeBtn, "shopCloseBtn");
    this.trackDomListener(closeBtn, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.ACTION.SHOP.CLOSE, {});
    });

    this._draw.appendChild(header, playerInfo);
    this._draw.appendChild(header, title);
    this._draw.appendChild(header, closeBtn);

    // ========================================
    // 메인 컨텐츠 (좌측 탭 + 우측 그리드)
    // ========================================
    const content = this._draw.createElement("div", "shop-content");

    // 좌측: 탭 메뉴
    const categoryTabs = this._draw.createElement("div", "shop-category-tabs");

    const tabs = [
      { id: "cards", label: "🃏 CARDS" },
      { id: "items", label: "💎 ITEMS" },
      { id: "upgrade", label: "⚡ UPGRADE" },
      { id: "remove", label: "🗑️ REMOVE" },
    ];

    tabs.forEach((tab, index) => {
      const tabBtn = this._draw.createElement("button", "shop-tab");
      if (index === 0) this._draw.addClass(tabBtn, "active");
      this._draw.setText(tabBtn, tab.label);
      this._draw.addDataset(tabBtn, "category", tab.id);

      this.trackDomListener(tabBtn, EVENTS.DOM.CLICK, () => {
        // 모든 탭 비활성화
        const allTabs = this._draw.getElements(".shop-tab", categoryTabs);
        allTabs.forEach((t) => this._draw.removeClass(t, "active"));

        // 클릭한 탭 활성화
        this._draw.addClass(tabBtn, "active");

        // 상품 필터링
        this.#filterShopProducts(tab.id);
      });

      this._draw.appendChild(categoryTabs, tabBtn);
    });

    // 우측: 상품 그리드
    const productGrid = this._draw.createElement("div", "shop-product-grid");
    this._draw.setId(productGrid, "shopProductGrid");

    // 초기 상품 렌더링 (데모 데이터)
    this.#renderInitialShopProducts(productGrid);

    this._draw.appendChild(content, categoryTabs);
    this._draw.appendChild(content, productGrid);

    // 조립
    this._draw.appendChild(container, header);
    this._draw.appendChild(container, content);
    this._draw.appendChild(screen, container);
    this._draw.appendChild(document.body, screen);
  }

  /**
   * 초기 상점 상품 렌더링 (데모)
   * @param {HTMLElement} grid
   */
  #renderInitialShopProducts(grid) {
    // 데모 카드 상품
    const demoCards = [
      {
        rank: "A",
        suit: "♠",
        suitClass: "suit-spade",
        rarity: "rare",
        title: "ACE OF SPADES",
        desc: "Deal massive damage",
        price: 150,
        category: "cards",
        type: "upgrade",
      },
      {
        rank: "K",
        suit: "♥",
        suitClass: "suit-heart",
        rarity: "uncommon",
        title: "KING OF HEARTS",
        desc: "Heal on attack",
        price: 100,
        category: "cards",
        type: "upgrade",
      },
      {
        rank: "Q",
        suit: "♦",
        suitClass: "suit-diamond",
        rarity: "uncommon",
        title: "QUEEN OF DIAMONDS",
        desc: "Double gold rewards",
        price: 120,
        category: "cards",
      },
      { rank: "J", suit: "♣", suitClass: "suit-club", rarity: "common", title: "JACK OF CLUBS", desc: "Block incoming damage", price: 80, category: "cards" },
      { rank: "10", suit: "♥", suitClass: "suit-heart", rarity: "common", title: "10 OF HEARTS", desc: "Restore health", price: 60, category: "cards" },
      { rank: "9", suit: "♠", suitClass: "suit-spade", rarity: "common", title: "9 OF SPADES", desc: "Quick attack", price: 50, category: "cards" },
    ];

    const demoItems = [
      { icon: "💊", title: "HEALTH POTION", desc: "Restore 50 HP", price: 75, category: "items", type: "item" },
      { icon: "🛡️", title: "SHIELD", desc: "Block 20 damage", price: 100, category: "items", type: "item" },
      { icon: "⚔️", title: "SWORD", desc: "+10 attack", price: 150, category: "items", type: "item" },
    ];

    const demoUpgrades = [
      { icon: "⚡", title: "POWER UP", desc: "Increase damage by 25%", price: 200, category: "upgrade", type: "upgrade" },
      { icon: "🔥", title: "BURN EFFECT", desc: "Add burn to attacks", price: 180, category: "upgrade", type: "upgrade" },
    ];

    // 카드 렌더링
    demoCards.forEach((data, idx) => {
      const card = this.#createTrumpCard(data, idx);
      this._draw.appendChild(grid, card);
    });

    // 아이템 렌더링 (초기 숨김)
    demoItems.forEach((data, idx) => {
      const card = this.#createItemCard(data, idx);
      this._draw.addClass(card, "hidden");
      this._draw.appendChild(grid, card);
    });

    // 업그레이드 렌더링 (초기 숨김)
    demoUpgrades.forEach((data, idx) => {
      const card = this.#createItemCard(data, idx);
      this._draw.addClass(card, "hidden");
      this._draw.appendChild(grid, card);
    });
  }

  /**
   * 트럼프 카드 상품 생성
   * @param {Object} data 카드 데이터
   * @param {string} data.rank 숫자
   * @param {string} data.suit 문양
   * @param {string} data.suitClass 문양 class 명
   * @param {string} data.rarity 레어도
   * @param {string} data.title 카드명
   * @param {string} data.desc 설명
   * @param {string} data.price 가격
   * @param {string} data.category 카테고리
   * @param {number} index 카드 Index
   * @returns {HTMLElement} 카드 엘리먼트
   */
  #createTrumpCard(data, index) {
    const card = this._draw.createElement("div", "shop-product-card");
    this._draw.addDataset(card, "category", data.category);
    this._draw.addDataset(card, "rarity", data.rarity);
    this._draw.addDataset(card, "index", index);

    // 좌상단 rank
    const rankTop = this._draw.createElement("div", "product-rank");
    this._draw.setText(rankTop, data.rank);

    // 좌상단 suit
    const suitTop = this._draw.createElement("div", `product-suit-top ${data.suitClass}`);
    this._draw.setText(suitTop, data.suit);

    // 중앙 suit
    const suitCenter = this._draw.createElement("div", `product-suit-center ${data.suitClass}`);
    this._draw.setText(suitCenter, data.suit);

    // 우하단 rank
    const rankBottom = this._draw.createElement("div", "product-rank-bottom");
    this._draw.setText(rankBottom, data.rank);

    // 우하단 suit
    const suitBottom = this._draw.createElement("div", `product-suit-bottom ${data.suitClass}`);
    this._draw.setText(suitBottom, data.suit);

    // 가격
    const price = this._draw.createElement("div", "product-price");
    this._draw.setText(price, `💰 ${data.price}`);

    this.trackDomListener(card, EVENTS.DOM.MOUSEENTER, () => {
      this.eventBus.emit(EVENTS.ACTION.RENDER.TOOLTIP.SHOW, {
        target: card,
        title: data.title,
        description: data.desc,
      });
    });

    this.trackDomListener(card, EVENTS.DOM.MOUSELEAVE, () => {
      this.eventBus.emit(EVENTS.ACTION.RENDER.TOOLTIP.HIDE, {});
    });

    // 조립
    this._draw.appendChild(card, rankTop);
    this._draw.appendChild(card, suitTop);
    this._draw.appendChild(card, suitCenter);
    this._draw.appendChild(card, rankBottom);
    this._draw.appendChild(card, suitBottom);
    this._draw.appendChild(card, price);

    // 클릭 이벤트
    this.trackDomListener(card, EVENTS.DOM.CLICK, () => {
      this.eventBus.emit(EVENTS.SHOP.ITEM_SELECTED, {
        type: "card",
        data: data,
        index: index,
      });
    });

    return card;
  }

  /**
   * 상품 필터링
   * @param {string} category
   */
  #filterShopProducts(category) {
    const grid = this._draw.getElementById("shopProductGrid");
    if (!grid) return;

    const allProducts = this._draw.getElements(".shop-product-card", grid);

    allProducts.forEach((product, index) => {
      const productCategory = this._draw.getDataset(product, "category");

      if (productCategory === category) {
        this._draw.removeClass(product, "hidden");
        // 순차 애니메이션
        const prevStyle = this._draw.getStyle();
        this._draw.setStyle(product, { ...prevStyle, animation: "none" });
        // product.offsetHeight; // 리플로우 트리거
        this._draw.setStyle(product, { ...prevStyle, animation: `fadeInUp 0.3s ease ${index * 0.05}s forwards` });
      } else {
        this._draw.addClass(product, "hidden");
      }
    });
  }

  /**
   * 아이템/업그레이드 카드 생성
   * @param {Object} data 아이템 데이터
   * @param {string} data.icon 아이템 아이콘
   * @param {string} data.title 아이템명
   * @param {string} data.desc 설명
   * @param {string} data.price 금액
   * @param {string} data.category 카테고리
   * @param {string} data.type item
   * @returns {HTMLElement} 카드 엘리먼트
   */
  #createItemCard(data) {
    const card = this._draw.createElement("div", `shop-product-card ${data.type}-card`);
    this._draw.addDataset(card, "category", data.category);

    // 아이콘
    const icon = this._draw.createElement("div", `${data.type}-icon`);
    this._draw.setText(icon, data.icon);

    // 가격
    const price = this._draw.createElement("div", "product-price");
    this._draw.setText(price, `💰 ${data.price}`);

    // Tooltip
    this.trackDomListener(card, EVENTS.DOM.MOUSEENTER, () => {
      this.eventBus.emit(EVENTS.ACTION.RENDER.TOOLTIP.SHOW, {
        target: card,
        title: data.title,
        description: data.desc,
      });
    });

    this.trackDomListener(card, EVENTS.DOM.MOUSELEAVE, () => {
      this.eventBus.emit(EVENTS.ACTION.RENDER.TOOLTIP.HIDE, {});
    });

    // 조립
    this._draw.appendChild(card, icon);
    this._draw.appendChild(card, price);

    return card;
  }
}
