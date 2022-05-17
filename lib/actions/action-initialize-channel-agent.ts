import type { TypeContract } from '@balena/jellyfish-types/build/core';
import { ActionDefinition, errors } from '@balena/jellyfish-worker';
import { strict as assert } from 'assert';
import _ from 'lodash';

const handler: ActionDefinition['handler'] = async (
	session,
	context,
	channel,
	request,
) => {
	console.log('=== action-initialize-channel-agent ===');
	// Assert that we have all necessary types
	['link', 'agent-channel-settings'].forEach((type) => {
		assert(
			context.cards[`${type}@1.0.0`],
			new errors.WorkerNoElement(`Type not found ${type}@1.0.0`),
		);
	});

	// Assert that the agent contract exists
	const agent = await context.getCardById(
		context.privilegedSession,
		request.arguments.agent,
	);
	assert(
		agent,
		new errors.WorkerNoElement(`Agent not found: ${request.arguments.agent}`),
	);

	// Create agent-channel-settings contract if necessary
	const agentChannelSettings = await context.query(session, {
		type: 'object',
		required: ['id'],
		properties: {
			id: {
				type: 'string',
				const: agent.id,
			},
		},
		$$links: {
			'has settings': {
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
						required: ['id'],
						properties: {
							id: {
								type: 'string',
								const: channel.id,
							},
						},
					},
				},
			},
		},
	});
	if (!agentChannelSettings[0]) {
		console.log('Creating agent-channel-settings contract');
		const settings = await context.insertCard(
			session,
			context.cards['agent-channel-settings@1.0.0'] as TypeContract,
			{},
			{
				type: 'agent-channel-settings@1.0.0',
			},
		);
		await Promise.all([
			context.insertCard(
				session,
				context.cards['link@1.0.0'] as TypeContract,
				{},
				{
					type: 'link',
					name: 'has settings',
					data: {
						inverseName: 'are settings for',
						from: {
							type: agent.type,
							id: agent.id,
						},
						to: {
							type: settings!.type,
							id: settings!.id,
						},
					},
				},
			),
			context.insertCard(
				session,
				context.cards['link@1.0.0'] as TypeContract,
				{},
				{
					type: 'link',
					name: 'has settings',
					data: {
						inverseName: 'are settings for',
						from: {
							type: channel.type,
							id: channel.id,
						},
						to: {
							type: settings!.type,
							id: settings!.id,
						},
					},
				},
			),
		]);
	}

	return {
		id: channel.id,
		type: channel.type,
		version: channel.version,
		slug: channel.slug,
	};
};

export const actionInitializeChannelAgent: ActionDefinition = {
	handler,
	contract: {
		slug: 'action-initialize-channel-agent',
		version: '1.0.0',
		type: 'action@1.0.0',
		name: 'Initialize a channel agent',
		data: {
			filter: {
				type: 'object',
				required: ['active', 'type'],
				properties: {
					active: {
						type: 'boolean',
						const: true,
					},
					type: {
						type: 'string',
						const: 'channel@1.0.0',
					},
				},
			},
			arguments: {
				agent: {
					type: 'string',
					format: 'uuid',
				},
			},
		},
	},
};
