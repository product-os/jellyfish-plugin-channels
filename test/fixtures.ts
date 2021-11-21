import { v4 as uuid } from 'uuid';

export const viewCardType = {
	slug: 'view',
	type: 'type@1.0.0',
};

export const linkCardType = {
	slug: 'link',
	type: 'type@1.0.0',
};

export const testChannel = {
	id: `channel-${uuid()}`,
	slug: 'channel-test-cards',
	name: 'Test Cards',
	type: 'channel@1.0.0',
	version: '1.0.0',
	tags: [],
	markers: [],
	links: {},
	created_at: '2021-03-18T23:29:51.132Z',
	active: true,
	data: {
		filter: {
			name: 'Test cards',
			schema: {
				type: 'object',
				properties: {
					active: {
						const: true,
						type: 'boolean',
					},
					type: {
						type: 'string',
						const: 'test@1.0.0',
					},
				},
				required: ['active', 'type'],
				additionalProperties: true,
			},
		},
	},
	requires: [],
	capabilities: [],
};
