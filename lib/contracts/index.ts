import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { channel } from './channel';
import { triggeredActionBootstrapChannel } from './triggered-action-bootstrap-channel';

export const contracts: ContractDefinition[] = [
	channel,
	triggeredActionBootstrapChannel,
];
