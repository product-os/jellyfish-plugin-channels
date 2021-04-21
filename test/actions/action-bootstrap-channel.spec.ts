/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import _ from 'lodash';
import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import {
	ContractDefinition,
	ContractSummary,
} from '@balena/jellyfish-types/build/core';
import { testChannel, viewCardType, linkCardType } from '../fixtures';
import actionBootStrapChannel from '../../lib/actions/action-bootstrap-channel';

const sandbox = sinon.createSandbox();

describe('action-bootstrap-channel', () => {
	let context: any = null;
	let session: any = null;
	let request: any = null;

	beforeEach(() => {
		session = {};
		(context = {
			getCardBySlug: sandbox.stub(),
			replaceCard: (
				_session: any,
				_typeCard: any,
				_options: any,
				cardBase: ContractDefinition,
			) => {
				return {
					id: `${cardBase.type.split('@')[0]}-${uuid()}`,
					...cardBase,
				};
			},
		}),
			context.getCardBySlug.onCall(0).resolves(viewCardType);
		context.getCardBySlug.onCall(1).resolves(linkCardType);

		request = {
			timestamp: new Date().toISOString(),
			actor: 'actor-1',
			originator: 'originator',
			context: {
				id: 'action-bootstrap-channel-test',
			},
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	test('action-bootstrap-channel creates 3 views and links them to the channel', async () => {
		const replaceCardSpy = sandbox.spy(context, 'replaceCard');
		const result = await actionBootStrapChannel.handler(
			session,
			context,
			testChannel,
			request,
		);
		expect(result).not.toBeNull();
		const testChannelSummary = result as ContractSummary;

		expect(testChannelSummary.id).toEqual(testChannel.id);
		expect(replaceCardSpy.callCount).toBe(6);

		const [
			viewAll,
			viewOwnedByMe,
			viewUnowned,
			linkViewAll,
			linkViewOwnedByMe,
			linkViewUnowned,
		] = replaceCardSpy.getCalls().map((call) => call.returnValue);

		expect(viewAll.slug).toBe('view-all-test-cards');
		expect(viewOwnedByMe.slug).toBe('view-test-cards-owned-by-me');
		expect(viewUnowned.slug).toBe('view-unowned-test-cards');
		expect(linkViewAll.slug).toBe(
			`link-${viewAll.id}-is-attached-to-${testChannel.id}`,
		);
		expect(linkViewOwnedByMe.slug).toBe(
			`link-${viewOwnedByMe.id}-is-attached-to-${testChannel.id}`,
		);
		expect(linkViewUnowned.slug).toBe(
			`link-${viewUnowned.id}-is-attached-to-${testChannel.id}`,
		);
	});
});
