import type { ActionDefinition } from '@balena/jellyfish-worker';
import { actionBootstrapChannel } from './action-bootstrap-channel';
import { actionInitializeChannelAgent } from './action-initialize-channel-agent';

export const actions: ActionDefinition[] = [
    actionBootstrapChannel,
    actionInitializeChannelAgent,
];
