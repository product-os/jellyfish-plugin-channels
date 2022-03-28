import type {
	ContractDefinition,
	ContractSummary,
} from '@balena/jellyfish-types/build/core';
import sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import { actionBootstrapChannel } from '../../lib/actions/action-bootstrap-channel';
import { linkContractType, testChannel, viewContractType } from '../fixtures';

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
				_typeContract: any,
				_options: any,
				contract: ContractDefinition,
			) => {
				return {
					id: `${contract.type.split('@')[0]}-${uuidv4()}`,
					...contract,
				};
			},
		}),
			context.getCardBySlug.onCall(0).resolves(viewContractType);
		context.getCardBySlug.onCall(1).resolves(linkContractType);

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

		expect(viewAll.slug).toBe('view-all-test-contracts');
		expect(viewOwnedByMe.slug).toBe('view-test-contracts-owned-by-me');
		expect(viewUnowned.slug).toBe('view-unowned-test-contracts');
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
