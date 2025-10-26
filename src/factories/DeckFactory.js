class DeckFactory {
  /**
   * 덱 생성
   */
  static createDeckById(deckId) {
    const deckDef = this.findDeckDefinitionById(deckId);
    if (!deckDef) return null;

    const cards = deckDef.cards.map((cardDef) => CardFactory.createCardById(cardDef.id));

    return new Deck(cards);
  }

  #findDeckDefinitionById(deckId) {
    return DECKS[deckId] || null;
  }
}
