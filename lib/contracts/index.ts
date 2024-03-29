import type { ContractDefinition } from '@balena/jellyfish-types/build/core';
import { agentChannelSettings } from './agent-channel-settings';
import { channel } from './channel';
import { relationshipChannelHasAgentUser } from './relationship-channel-has-agent-user';
import { relationshipChannelHasSettingsAgentChannelSettings } from './relationship-channel-has-settings-agent-channel-settings';
import { relationshipUserHasSettingsAgentChannelSettings } from './relationship-user-has-settings-agent-channel-settings';
import { relationshipViewIsAttachedToChannel } from './relationship-view-is-attached-to-channel';
import { triggeredActionBootstrapChannel } from './triggered-action-bootstrap-channel';

export const contracts: ContractDefinition[] = [
	agentChannelSettings,
	channel,
	relationshipChannelHasAgentUser,
	relationshipChannelHasSettingsAgentChannelSettings,
	relationshipUserHasSettingsAgentChannelSettings,
	relationshipViewIsAttachedToChannel,
	triggeredActionBootstrapChannel,
];
