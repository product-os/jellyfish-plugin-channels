import { defaultPlugin } from '@balena/jellyfish-plugin-default';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { testUtils } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import _ from 'lodash';
import { channelsPlugin } from '../../../lib';

let ctx: testUtils.TestContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), channelsPlugin()],
	});
});

afterAll(() => {
	return testUtils.destroyContext(ctx);
});

describe('triggered-action-bootstrap-channel', () => {
	test('views and triggered actions should be generated for a channel', async () => {
		// Add new channel
		const channel = await ctx.worker.insertCard(
			ctx.logContext,
			ctx.session,
			ctx.worker.typeContracts['channel@1.0.0'],
			{
				timestamp: new Date().toISOString(),
				actor: ctx.adminUserId,
				attachEvents: true,
			},
			{
				slug: 'channel-foobar',
				name: 'Foobar Channel',
				type: 'channel@1.0.0',
				markers: [],
				loop: '',
				data: {
					filter: {
						name: 'Foobar contracts',
						schema: {
							type: 'object',
							additionalProperties: true,
							required: ['type', 'data'],
							properties: {
								type: {
									type: 'string',
									const: 'card@1.0.0',
								},
								data: {
									type: 'object',
									additionalProperties: true,
									required: ['foo'],
									properties: {
										foo: {
											type: 'string',
											const: 'bar',
										},
									},
								},
							},
						},
					},
				},
			},
		);
		assert(channel);
		await ctx.flush(ctx.session);

		// Check that views were generated
		await ctx.waitForMatch({
			type: 'object',
			properties: {
				type: {
					const: 'view@1.0.0',
				},
			},
			$$links: {
				'is attached to': {
					type: 'object',
					properties: {
						id: channel.id,
					},
				},
			},
		});

		// Check that the triggered action was generated
		await ctx.waitForMatch({
			type: 'object',
			properties: {
				type: {
					const: 'triggered-action@1.0.0',
				},
			},
			$$links: {
				'is attached to': {
					type: 'object',
					properties: {
						id: channel.id,
					},
				},
			},
		});
	});
});
