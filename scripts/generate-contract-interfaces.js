const path = require('path')
const {
	scripts
} = require('@balena/jellyfish-types');
const coreMixins = require('@balena/jellyfish-core/build/cards/mixins');
const { ChannelsPlugin } = require('../build')

const context = {
	id: 'jellyfish-plugin-generate-types'
}

const plugin = new ChannelsPlugin()
const cards = plugin.getCards(context, coreMixins)
const dir = path.resolve(__dirname, '../lib/types/contracts')

scripts.generateContractInterfaces(dir, cards)
