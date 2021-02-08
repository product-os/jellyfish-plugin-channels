/*
 * Copyright (C) Balena.io - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited.
 * Proprietary and confidential.
 */

const {
  JellyfishPluginBase
} = require('@balena/jellyfish-plugin-base')
const cards = require('./cards')
const actions = require('./actions')
const {
  version
} = require('../package.json')

/**
 * The Channels Jellyfish plugin.
 */
module.exports = class ChannelsPlugin extends JellyfishPluginBase {
  constructor () {
    super({
      slug: 'jellyfish-plugin-channels',
      name: 'Channels Plugin',
      version,
      cards,
      actions
    })
  }
}
