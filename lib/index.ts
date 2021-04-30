/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { JellyfishPluginBase } from '@balena/jellyfish-plugin-base';
import { contracts } from './contracts';
import { actions } from './actions';

// tslint:disable-next-line: no-var-requires
const { version } = require('../package.json');

export * from './types';

/**
 * The Channels Jellyfish plugin.
 */
export class ChannelsPlugin extends JellyfishPluginBase {
	constructor() {
		super({
			slug: 'jellyfish-plugin-channels',
			name: 'Channels Plugin',
			version,
			cards: contracts,
			actions,
		});
	}
}
