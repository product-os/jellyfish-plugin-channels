import isEmpty from 'lodash/isEmpty';
import { cardMixins as coreMixins } from '@balena/jellyfish-core';
import { ChannelsPlugin } from '../lib/index';

const context = {
	id: 'jellyfish-plugin-channels-test',
};

const plugin = new ChannelsPlugin();

test('Plugin returns collection of cards', () => {
	const cards = plugin.getCards(context, coreMixins);

	expect(isEmpty(cards)).toBeFalsy();
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
