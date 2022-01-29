import sinon from 'sinon';
import { v4 as uuid } from 'uuid';
import {
	ContractDefinition,
	ContractSummary,
} from '@balena/jellyfish-types/build/core';
import { testChannel, viewCardType, linkCardType } from '../fixtures';
import { actionBootstrapChannel } from '../../lib/actions/action-bootstrap-channel';

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
				card: ContractDefinition,
			) => {
				return {
					id: `${card.type.split('@')[0]}-${uuid()}`,
					...card,
				};
			},
		}),
			context.getCardBySlug.onCall(0).resolves(viewCardType);
		context.getCardBySlug.onCall(1).resolves(linkCardType);

		request = {
			timestamp: new Date().toISOString(),
			actor: 'actor-1',
			originator: 'originator',
			logContext: {
				id: 'action-bootstrap-channel-test',
			},
		};
	});

	afterEach(() => {
		sandbox.restore();
	});

	test('action-bootstrap-channel creates 3 views and links them to the channel', async () => {
		const replaceCardSpy = sandbox.spy(context, 'replaceCard');
		const testChannelSummary = (await actionBootstrapChannel.handler(
			session,
			context,
			testChannel,
			request,
		)) as ContractSummary;
		expect(testChannelSummary).not.toBeNull();

		expect(testChannelSummary?.id).toEqual(testChannel?.id);
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
