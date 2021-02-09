/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

export default {
	slug: 'triggered-action-bootstrap-channel',
	type: 'triggered-action@1.0.0',
	name: 'Triggered action for bootstrapping a channel',
	markers: [],
	data: {
		schedule: 'enqueue',
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
					enum: ['create@1.0.0', 'update@1.0.0'],
				},
				data: {
					type: 'object',
					required: ['payload'],
					properties: {
						payload: {
							type: 'object',
							required: ['slug', 'type'],
							properties: {
								slug: {
									type: 'string',
								},
								type: {
									type: 'string',
									const: 'channel@1.0.0',
								},
							},
						},
					},
				},
			},
		},
		action: 'action-bootstrap-channel@1.0.0',

		// eslint-disable-next-line
		target: '${source.data.payload.slug}@1.0.0',
		arguments: {},
	},
};
