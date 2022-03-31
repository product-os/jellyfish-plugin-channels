import type { TriggeredActionContractDefinition } from '@balena/jellyfish-worker';

export const triggeredActionCreateAgentChannelSettings: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-create-agent-channel-settings',
		type: 'triggered-action@1.0.0',
		name: 'Create agent-channel-settings contract when agents are linked',
		markers: [],
		data: {
			filter: {
				type: 'object',
				required: ['type', 'name'],
				properties: {
					created_at: {
						title:
							'Triggers when a contract is linked to a channel as an agent',
					},
					type: {
						type: 'string',
						const: 'link@1.0.0',
					},
					name: {
						type: 'string',
						const: 'has agent',
					},
					data: {
						type: 'object',
						required: ['from', 'to'],
						properties: {
							from: {
								type: 'object',
								required: ['type'],
								properties: {
									type: {
										type: 'string',
										const: 'channel@1.0.0',
									},
								},
							},
							to: {
								type: 'object',
								required: ['type'],
								properties: {
									type: {
										type: 'string',
										enum: ['user@1.0.0', 'transformer-worker@1.0.0'],
									},
								},
							},
						},
					},
				},
			},
			action: 'action-create-card@1.0.0',
			target: 'agent-channel-settings@1.0.0',
			arguments: {
				reason: null,
				properties: {
					data: {},
					links: {
						'are settings for': [
							{
								id: {
									$eval: 'source.data.from.id',
								},
								type: {
									$eval: 'source.data.from.type',
								},
							},
							{
								id: {
									$eval: 'source.data.to.id',
								},
								type: {
									$eval: 'source.data.to.type',
								},
							},
						],
					},
				},
			},
		},
	};
