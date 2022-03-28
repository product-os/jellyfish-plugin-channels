import { PluginManager } from '@balena/jellyfish-worker';
import _ from 'lodash';
import { channelsPlugin } from '../lib/index';

const pluginManager = new PluginManager([channelsPlugin()]);

test('Plugin returns collection of contracts', () => {
	const contracts = pluginManager.getCards();
	expect(_.isEmpty(contracts)).toBeFalsy();
});

test('Expected contracts are loaded', () => {
	const contracts = pluginManager.getCards();
	expect(contracts.channel.name).toBe('Channel');
	expect(contracts['action-bootstrap-channel'].slug).toBe(
		'action-bootstrap-channel',
	);
});

test('Expected actions are loaded', () => {
	const actions = pluginManager.getActions();
	expect(typeof actions['action-bootstrap-channel'].handler).toBe('function');
});
