import { defaultPlugin } from '@balena/jellyfish-plugin-default';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import { testUtils } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { testUtils as autumndbTestUtils } from 'autumndb';
import _ from 'lodash';
import { channelsPlugin } from '../../../lib';

let ctx: testUtils.TestContext;
let user: any = {};
let username = '';

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), channelsPlugin()],
	});

	username = autumndbTestUtils.generateRandomId();
	user = await ctx.createUser(username);
});

afterAll(() => {
	return testUtils.destroyContext(ctx);
});

describe('triggered-action-create-agent-channel-settings', () => {
	test('linking a user to a channel as an agent should create an agent-channel-settings contract', async () => {
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
				slug: autumndbTestUtils.generateRandomSlug({
					prefix: 'channel',
				}),
				name: 'Foobar Channel',
				type: 'channel@1.0.0',
				markers: [],
				loop: '',
				data: {
					filter: {
						name: 'Foobar Channel',
						schema: {
							type: 'object',
							additionalProperties: true,
							required: ['type'],
							properties: {
								type: {
									type: 'string',
									const: 'card@1.0.0',
								},
							},
						},
					},
				},
			},
		);
		assert(channel);
		await ctx.flush(ctx.session);

		await ctx.createLinkThroughWorker(
			ctx.adminUserId,
			ctx.kernel.adminSession()!,
			channel,
			user,
			'has agent',
			'is agent for',
		);

		const match = await ctx.waitForMatch({
			type: 'object',
			required: ['type'],
			properties: {
				type: {
					type: 'string',
					const: 'agent-channel-settings@1.0.0',
				},
			},
			$$links: {
				'are settings for': {
					type: 'object',
				},
			},
		});

		expect(
			match.links?.['are settings for'].map((contract) => {
				return {
					id: contract.id,
					type: contract.type,
				};
			}),
		).toEqual(
			expect.arrayContaining([
				{
					id: channel.id,
					type: channel.type,
				},
				{
					id: user.id,
					type: user.type,
				},
			]),
		);
	});
});
