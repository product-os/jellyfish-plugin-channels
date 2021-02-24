/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import _ from 'lodash';
import coreMixins from '@balena/jellyfish-core/lib/cards/mixins';
import { ChannelsPlugin } from '../lib/index';

const context = {
	id: 'jellyfish-plugin-channels-test',
};

const plugin = new ChannelsPlugin();

test('Plugin returns collection of cards', () => {
	const cards = plugin.getCards(context, coreMixins);

	expect(_.isEmpty(cards)).toBeFalsy();
});

test('Expected cards are loaded', () => {
	const cards = plugin.getCards(context, coreMixins);

	// Sanity check
	expect(cards.channel.name).toBe('Channel');
	expect(cards['action-bootstrap-channel'].slug).toBe(
		'action-bootstrap-channel',
	);
});

test('Expected actions are loaded', () => {
	const actions = plugin.getActions(context);

	// Sanity check
	expect(typeof actions['action-bootstrap-channel'].handler).toBe('function');
});
