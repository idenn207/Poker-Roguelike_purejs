// 덱 초기화 및 셔플
const deck = new Deck();
deck.initialize().shuffle();

// 10장 드로우
const drawnCards = deck.draw(10);
console.log(`Drew ${drawnCards.length} cards`);
console.log(`Hand size: ${deck.hand.length}`);

// 특정 카드 버리기 (인덱스 0, 2, 4번 카드)
const discarded = deck.discard([0, 2, 4]);
console.log(`Discarded ${discarded.length} cards`);

// 카드 교환 (1, 3번 카드를 버리고 새로 드로우)
const exchangeResult = deck.exchange([1, 3]);
console.log(`Exchanged: discarded ${exchangeResult.discarded.length}, drew ${exchangeResult.drawn.length}`);

// 특정 조건의 카드 찾기 (손패에서 하트 카드)
const hearts = deck.findCards((card) => card.suit.name === 'heart', 'hand');
console.log(`Hearts in hand: ${hearts.length}`);

// 손패 정렬
deck.sortHand();

// 덱 상태 확인
const status = deck.getStatus();
console.log('Deck status:', status);
