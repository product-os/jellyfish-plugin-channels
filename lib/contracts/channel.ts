/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import {
	ContractDefinition,
	TypeData,
} from '@balena/jellyfish-types/build/core';

export const channel: ContractDefinition<TypeData> = {
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
