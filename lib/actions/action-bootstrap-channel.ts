/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { Card } from "@balena/jellyfish-plugin-base"

const logger = require('@balena/jellyfish-logger').getLogger(__filename)

const handler = async (_session: any, _context: any, card: Card, request: any) => {
	logger.info(request.context, 'Bootstrapping channel', {
		id: card.id,
		slug: card.slug,
		type: card.type
	})
}

module.exports = {
	handler,
	card: {
		slug: 'action-bootstrap-channel',
		type: 'action@1.0.0',
		name: 'Bootstrap a channel',
		data: {
      filter: {
				type: 'object',
				properties: {
					type: {
						type: 'string',
						const: 'channel@1.0.0'
					}
				},
				required: [
					'type'
				]
			}
		}
	}
}
