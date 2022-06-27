import type { Contract } from '@balena/jellyfish-types/build/core';
import type { ChannelContract } from '../../lib/types';

describe('channel', () => {
	const channel: ChannelContract = {
		id: 'id1',
		slug: 'channel-1',
		type: 'channel@1.0.0',
		version: '1.0.0',
		tags: [],
		markers: [],
		created_at: '2019-06-19T08:32:33.142Z',
		active: true,
		requires: [],
		capabilities: [],
		data: {
			filter: {},
		},
	};

	test('can be cast to a Contract', () => {
		const contract: Contract = channel;
		expect(contract.id).toBe(channel.id);
	});
});
