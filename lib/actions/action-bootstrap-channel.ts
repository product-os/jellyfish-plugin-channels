/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { strict as nativeAssert } from 'assert';
import merge from 'lodash/merge';
import slugify from 'slugify';
import type { ActionFile } from '@balena/jellyfish-plugin-base';
import { getLogger } from '@balena/jellyfish-logger';
import type {
	ContractDefinition,
	TypeContract,
} from '@balena/jellyfish-types/build/core';
import type { ChannelContract } from '../types';

const logger = getLogger(__filename);

const capitalizeFirst = (str: string): string => {
	return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

// TS-TODO: the return type should be Partial<ViewContractDefinition>
const commonView = (
	channelContract: ChannelContract,
): Partial<ContractDefinition> => {
	return {
		version: '1.0.0',
		type: 'view@1.0.0',
		markers: ['org-balena'],
		tags: [],
		active: true,
		data: {
			namespace: channelContract.name,
		},
		requires: [],
		capabilities: [],
	};
};

const createViewAll = (
	channelContract: ChannelContract,
): Partial<ContractDefinition> => {
	const channelName = channelContract.name!.toLowerCase();
	return merge({}, commonView(channelContract), {
		slug: `view-all-${slugify(channelName)}`,
		name: `All ${channelName}`,
		data: {
			allOf: [channelContract.data.filter],
		},
	});
};

const createOwnedByMeView = (
	channelContract: ChannelContract,
): Partial<ContractDefinition> => {
	const channelName = channelContract.name!.toLowerCase();
	return merge({}, commonView(channelContract), {
		slug: `view-${slugify(channelName)}-owned-by-me`,
		name: `${capitalizeFirst(channelName)} owned by me`,
		data: {
			allOf: [
				channelContract.data.filter,
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

const createUnownedView = (
	channelContract: ChannelContract,
): Partial<ContractDefinition> => {
	const channelName = channelContract.name!.toLowerCase();
	return merge({}, commonView(channelContract), {
		slug: `view-unowned-${slugify(channelName)}`,
		name: `Unowned ${channelName}`,
		data: {
			allOf: [
				channelContract.data.filter,
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

// TS-TODO: ActionFile should be generic so we can specify the contract data type
const handler: ActionFile['handler'] = async (
	session,
	context,
	card,
	request,
) => {
	logger.info(request.context, `Bootstrapping channel '${card.slug}'`);

	const viewTypeCard = await context.getCardBySlug(session, 'view@latest');
	nativeAssert(!!viewTypeCard, 'View type card not found');

	const linkTypeCard = await context.getCardBySlug(session, 'link@latest');
	nativeAssert(!!linkTypeCard, 'Link type card not found');

	// Create views based on the channel's base filter
	const views = [
		createViewAll(card as ChannelContract),
		createOwnedByMeView(card as ChannelContract),
		createUnownedView(card as ChannelContract),
	];

	await Promise.all(
		views.map(async (viewCardBase: any) => {
			// Save the view card
			let viewCard = await context.replaceCard(
				session,
				viewTypeCard as TypeContract,
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
			nativeAssert(!!viewCard, 'View card is null');

			// And create a link card between the view and the channel
			return context.replaceCard(
				session,
				linkTypeCard as TypeContract,
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

export const actionBootstrapChannel: ActionFile = {
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
