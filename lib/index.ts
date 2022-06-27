import type { PluginDefinition } from '@balena/jellyfish-worker';
import { actions } from './actions';
import { contracts } from './contracts';

export * from './types';

// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

/**
 * The Jellyfish channels plugin.
 */
export const channelsPlugin = (): PluginDefinition => {
	return {
		slug: 'plugin-channels',
		name: 'Channels Plugin',
		version,
		contracts,
		actions,
	};
};
