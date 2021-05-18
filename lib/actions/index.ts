/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import { ActionFile } from '@balena/jellyfish-plugin-base';
import { ContractData } from '@balena/jellyfish-types/build/core';
import { actionBootstrapChannel } from './action-bootstrap-channel';

export const actions: Array<ActionFile<ContractData>> = [
	actionBootstrapChannel,
];
