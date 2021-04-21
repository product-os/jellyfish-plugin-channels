/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import _ from 'lodash';
import slugify from 'slugify';
import type { ActionFile } from '@balena/jellyfish-plugin-base';
import type { Contract } from '@balena/jellyfish-types/build/core';
import { getLogger } from '@balena/jellyfish-logger';

const logger = getLogger(__filename);

const capitalizeFirst = (str: string) => {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

const commonView = (channelCard: any): any => {
	return {
		version: '1.0.0',
		type: 'view@1.0.0',
		markers: ['org-balena'],
		tags: [],
		links: {},
		active: true,
		data: {
			namespace: channelCard.name,
		},
		requires: [],
		capabilities: [],
	};
};

const createViewAll = (channelCard: any) => {
	const channelName = channelCard.name.toLowerCase();
	return _.merge({}, commonView(channelCard), {
		slug: `view-all-${slugify(channelName)}`,
		name: `All ${channelName}`,
		data: {
			allOf: [channelCard.data.filter],
		},
	});
};

const createOwnedByMeView = (channelCard: any) => {
	const channelName = channelCard.name.toLowerCase();
	return _.merge({}, commonView(channelCard), {
		slug: `view-${slugify(channelName)}-owned-by-me`,
		name: `${capitalizeFirst(channelName)} owned by me`,
		data: {
			allOf: [
				channelCard.data.filter,
				{
					name: 'Cards owned by me',
					schema: {
						type: 'object',
						$$links: {
							'is owned by': {
								type: 'object',
								properties: {
									type: {
										const: 'user@1.0.0',
									},
									id: {
										const: {
											$eval: 'user.id',
										},
									},
								},
							},
						},
					},
				},
			],
		},
	});
};

const createUnownedView = (channelCard: any) => {
	const channelName = channelCard.name.toLowerCase();
	return _.merge({}, commonView(channelCard), {
		slug: `view-unowned-${slugify(channelName)}`,
		name: `Unowned ${channelName}`,
		data: {
			allOf: [
				channelCard.data.filter,
				{
					name: 'Unowned cards',
					schema: {
						type: 'object',
						not: {
							$$links: {
								'is owned by': {
									properties: {
										type: {
											const: 'user@1.0.0',
										},
									},
								},
							},
						},
					},
				},
			],
		},
	});
};

const handler = async (
	session: any,
	context: any,
	card: Contract,
	request: any,
) => {
	logger.info(request.context, `Bootstrapping channel '${card.slug}'`);

	const viewTypeCard = await context.getCardBySlug(session, 'view@latest');
	const linkTypeCard = await context.getCardBySlug(session, 'link@latest');

	// Create views based on the channel's base filter
	const views = [
		createViewAll(card),
		createOwnedByMeView(card),
		createUnownedView(card),
	];

	await Promise.all(
		views.map(async (viewCardBase: any) => {
			// Save the view card
			let viewCard = await context.replaceCard(
				session,
				viewTypeCard,
				{
					timestamp: request.timestamp,
					actor: request.actor,
					originator: request.originator,
					attachEvents: true,
				},
				viewCardBase,
			);

			// If the view card already exists and no changes were made, replaceCard returns null,
			// so we just fetch the card by slug.
			if (viewCard === null) {
				viewCard = await context.getCardBySlug(
					session,
					`${viewCardBase.slug}@${viewCardBase.version}`,
				);
			}

			// And create a link card between the view and the channel
			return context.replaceCard(
				session,
				linkTypeCard,
				{
					timestamp: request.timestamp,
					actor: request.actor,
					originator: request.originator,
					attachEvents: false,
				},
				{
					slug: `link-${viewCard.id}-is-attached-to-${card.id}`,
					type: 'link@1.0.0',
					name: 'is attached to',
					data: {
						inverseName: 'has attached element',
						from: {
							id: viewCard.id,
							type: viewCard.type,
						},
						to: {
							id: card.id,
							type: card.type,
						},
					},
				},
			);
		}),
	);

	const result = card;

	return {
		id: result.id,
		type: result.type,
		version: result.version,
		slug: result.slug,
	};
};

const action: ActionFile = {
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
						const: 'channel@1.0.0',
					},
				},
				required: ['type'],
			},
			arguments: {},
		},
	},
};

export default action;
