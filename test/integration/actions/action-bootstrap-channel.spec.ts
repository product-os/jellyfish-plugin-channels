import { defaultPlugin } from '@balena/jellyfish-plugin-default';
import { productOsPlugin } from '@balena/jellyfish-plugin-product-os';
import {
	ActionContract,
	testUtils,
	WorkerContext,
} from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import { testUtils as autumndbTestUtils } from 'autumndb';
import _ from 'lodash';
import { channelsPlugin } from '../../../lib';
import { actionBootstrapChannel } from '../../../lib/actions/action-bootstrap-channel';

const handler = actionBootstrapChannel.handler;
let ctx: testUtils.TestContext;
let actionContext: WorkerContext;

beforeAll(async () => {
	ctx = await testUtils.newContext({
		plugins: [productOsPlugin(), defaultPlugin(), channelsPlugin()],
	});
	actionContext = ctx.worker.getActionContext({
		id: `test-${autumndbTestUtils.generateRandomId()}`,
	});
});

afterAll(() => {
	return testUtils.destroyContext(ctx);
});

describe('action-bootstrap-channel', () => {
	test('should create channel views and triggered actions', async () => {
		// Add new channel
		const channel = await ctx.kernel.insertContract(
			ctx.logContext,
			ctx.session,
			{
				slug: autumndbTestUtils.generateRandomSlug({
					prefix: 'channel',
				}),
				name: autumndbTestUtils.generateRandomId(),
				type: 'channel@1.0.0',
				markers: [],
				loop: '',
				data: {
					filter: {
						name: autumndbTestUtils.generateRandomId(),
						schema: {
							type: 'object',
							additionalProperties: true,
							required: ['type', 'data'],
							properties: {
								type: {
									type: 'string',
									const: 'card@1.0.0',
								},
								name: {
									type: 'string',
									const: autumndbTestUtils.generateRandomId(),
								},
							},
						},
					},
				},
			},
		);
		assert(channel);

		const action = await ctx.kernel.getContractBySlug<ActionContract>(
			ctx.logContext,
			ctx.session,
			'action-bootstrap-channel@1.0.0',
		);
		assert(action);

		await handler(ctx.session, actionContext, channel, {
			logContext: {
				id: `TEST-${autumndbTestUtils.generateRandomId()}`,
			},
			epoch: new Date().valueOf(),
			timestamp: new Date().toISOString(),
			actor: ctx.adminUserId,
			originator: autumndbTestUtils.generateRandomId(),
			action,
			card: channel.id,
			arguments: {},
		});

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
