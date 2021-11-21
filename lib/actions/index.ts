import { ActionFile } from '@balena/jellyfish-plugin-base';
import { ContractData } from '@balena/jellyfish-types/build/core';
import { actionBootstrapChannel } from './action-bootstrap-channel';

export const actions: Array<ActionFile<ContractData>> = [
	actionBootstrapChannel,
];
