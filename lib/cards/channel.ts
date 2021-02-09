/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

export default {
	slug: 'channel',
	name: 'Channel',
	type: 'type@1.0.0',
	data: {
		schema: {
			type: 'object',
			required: ['data'],
			properties: {
				data: {
					type: 'object',
					required: ['filter'],
					properties: {
						filter: {
							description:
								'Cards matching this filter will be handled by the channel',
							type: 'object',
						},
					},
				},
			},
		},
	},
};
