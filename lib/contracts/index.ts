import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { channel } from './channel';
import { relationshipViewIsAttachedToChannel } from './relationship-view-is-attached-to-channel';
import { triggeredActionBootstrapChannel } from './triggered-action-bootstrap-channel';
import { triggeredActionCreateAgentChannelSettings } from './triggered-action-create-agent-channel-settings';
import { triggeredActionCreateAgentSettings } from './triggered-action-create-agent-settings';
import { agentChannelSettings } from './agent-channel-settings';

export const contracts: ContractDefinition[] = [
	agentChannelSettings,
	channel,
	relationshipViewIsAttachedToChannel,
	triggeredActionBootstrapChannel,
	triggeredActionCreateAgentSettings,
	triggeredActionCreateAgentChannelSettings,
];
