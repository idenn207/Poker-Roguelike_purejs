/**
 * 파일위치: /src/managers/ShopManager.js
 * 파일명: ShopManager.js
 * 용도: 상점 시스템 관리
 * 기능: 상품 구매/판매 처리, 골드 거래
 * 책임: 상점 비즈니스 로직
 */

class ShopManager extends ManagerCore {
  constructor(eventBus) {
    super();

    /** @type {EventBus} */
    this.eventBus = eventBus;

    /** 상점 상품 목록 */
    this.products = [];

    console.debug('ShopManager Initialized');
  }

  /** 상점 초기화 */
  init() {
    console.debug('ShopManager init complete');
  }

  /** 상점 이벤트 등록 */
  registerEvents() {
    // 상점 열림
    this.trackEventBusListener(this.eventBus, EVENTS.SHOP.OPENED, this.onShopOpened.bind(this));

    // 상점 닫기 요청
    this.trackEventBusListener(this.eventBus, EVENTS.ACTION.SHOP.CLOSE, this.handleCloseShop.bind(this));

    // 상품 선택
    this.trackEventBusListener(this.eventBus, EVENTS.SHOP.ITEM_SELECTED, this.handleItemSelected.bind(this));

    console.debug('ShopManager events registered');
  }

  /**
   * 상점 열림 처리
   */
  onShopOpened() {
    console.log('Shop opened');

    // StateManager에게 플레이어 정보 요청
    this.eventBus.emit(EVENTS.QUERY.PLAYER.INFO, { requestId: 'shop-open' });

    // 상품 목록 준비
    this.prepareProducts();
  }

  /**
   * 상점 닫기 처리
   */
  handleCloseShop() {
    console.log('Closing shop');

    // 화면 전환 요청
    this.eventBus.emit(EVENTS.ACTION.SCREEN.CHANGE, { screenName: SCREEN_STATE_TYPE.REST });
  }

  /**
   * 상품 선택 처리
   * @param {Object} data
   * @param {string} data.type
   * @param {Object} data.data
   * @param {number} data.index
   */
  handleItemSelected(data) {
    const { type, data: itemData, index } = data;

    console.log(`Item selected: ${itemData.title} (${type})`);

    // StateManager에게 구매 요청
    this.eventBus.emit(EVENTS.ACTION.SHOP.PURCHASE, {
      type: type,
      price: itemData.price,
      itemData: itemData,
    });
  }

  /**
   * 상품 목록 준비
   */
  prepareProducts() {
    // TODO: 실제 상품 데이터 생성
    console.log('Preparing shop products');
  }

  update(deltaTime) {}
}
