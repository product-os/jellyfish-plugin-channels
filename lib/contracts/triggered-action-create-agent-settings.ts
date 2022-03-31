import type { TriggeredActionContractDefinition } from '@balena/jellyfish-worker';

export const triggeredActionCreateAgentSettings: TriggeredActionContractDefinition =
	{
		slug: 'triggered-action-create-agent-settings',
		type: 'triggered-action@1.0.0',
		name: 'Create agent-settings when agents are linked',
		markers: [],
		data: {
			filter: {
				type: 'object',
				required: ['type', 'name'],
				properties: {
					created_at: {
						title: 'Triggers when a contract is linked as an agent',
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
						required: ['to'],
						properties: {
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
			target: 'agent-settings@1.0.0',
			arguments: {
				reason: null,
				properties: {
					slug: {
						$eval: "join(['agent-settings', source.data.to.id], '-')",
					},
					data: {},
					links: {
						'are settings for': [
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
