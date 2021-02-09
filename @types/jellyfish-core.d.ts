/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// Temporary type definitions until jellyfish-core is converted to TypeScript

declare module '@balena/jellyfish-core/lib/cards/mixins' {
	function mixin(mixins: Card[]): (card: Card) => Card;
	function initialize(card: CardBase): Card;
}
