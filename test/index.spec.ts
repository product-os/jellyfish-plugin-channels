import { PluginManager } from '@balena/jellyfish-worker';
import _ from 'lodash';
import { channelsPlugin } from '../lib/index';

const pluginManager = new PluginManager([channelsPlugin()]);

test('Plugin returns collection of cards', () => {
	const cards = pluginManager.getCards();
	expect(_.isEmpty(cards)).toBeFalsy();
});

test('Expected cards are loaded', () => {
	const cards = pluginManager.getCards();
	expect(cards.channel.name).toBe('Channel');
	expect(cards['action-bootstrap-channel'].slug).toBe(
		'action-bootstrap-channel',
	);
});

test('Expected actions are loaded', () => {
	const actions = pluginManager.getActions();
	expect(typeof actions['action-bootstrap-channel'].handler).toBe('function');
});
