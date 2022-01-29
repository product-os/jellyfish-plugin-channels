import type { ActionDefinition } from '@balena/jellyfish-worker';
import { actionBootstrapChannel } from './action-bootstrap-channel';

export const actions: ActionDefinition[] = [actionBootstrapChannel];
