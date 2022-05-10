import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { channel } from './channel';
import { relationshipViewIsAttachedToChannel } from './relationship-view-is-attached-to-channel';
import { triggeredActionBootstrapChannel } from './triggered-action-bootstrap-channel';

export const contracts: ContractDefinition[] = [
	channel,
	relationshipViewIsAttachedToChannel,
	triggeredActionBootstrapChannel,
];
