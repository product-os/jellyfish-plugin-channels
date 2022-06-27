import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import type { TriggeredActionData } from '@balena/jellyfish-worker';

export const triggeredActionInitializeChannelAgent: ContractDefinition<TriggeredActionData> =
	{
		slug: 'triggered-action-initialize-channel-agent',
		type: 'triggered-action@1.0.0',
		name: 'Triggered action for initializing agents when linked to channels',
		markers: [],
		data: {
			filter: {
				type: 'object',
				required: ['active', 'type', 'data'],
				properties: {
					active: {
                        type: 'boolean',
						const: true,
					},
					type: {
                        type: 'string',
						const: 'link@1.0.0',
					},
                    name: {
                        type: 'string', const: 'has agent',
                    },
					data: {
						type: 'object',
						required: ['from', 'to'],
						properties: {
							from: {
								type: 'object',
								required: ['type', 'id'],
								properties: {
									type: {
                                        type: 'string',
										const: 'channel@1.0.0',
									},
                                    id: {
                                        type: 'string',
                                        format: 'uuid',
                                    },
								},
							},
							to: {
								type: 'object',
                                required: ['type', 'id'],
                                properties: {
                                    type: {
                                        type: 'string',
                                    },
                                    id: {
                                        type: 'string',
                                        format: 'uuid',
                                    },
                                }
							},
						},
					},
				},
			},
			action: 'action-initialize-channel-agent@1.0.0',
			target: '${source.data.from.id}',
			arguments: {
                agent: '${source.data.to.id}',
            },
		},
	};
