/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

import channel from './channel';
import triggeredActionBootstrapChannel from './triggered-action-bootstrap-channel';
import viewAllChannels from './view-all-channels';

export default [channel, triggeredActionBootstrapChannel, viewAllChannels];
