/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

// Temporary type definitions until jellyfish-core is converted to TypeScript

declare module '@balena/jellyfish-core' {
	function mixin(
		mixins: ContractDefinition[],
	): (card: ContractDefinition) => ContractDefinition;
	function initialize(card: ContractDefinition): ContractDefinition;
	export const cardMixins = {
		mixin,
		initialize,
	};
}
