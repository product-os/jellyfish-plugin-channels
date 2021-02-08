# Jellyfish Channels Plugin

Provides a set of cards and actions for adding 'channels' functionality to Jellyfish.

# Usage

Below is an example how to use this library:

```js
const coreMixins = require('@balena/jellyfish-core/lib/cards/mixins')
const ChannelsPlugin = require('@balena/jellyfish-plugin-channels')

const plugin = new ChannelsPlugin()

// Load cards from this plugin, can use custom mixins
const cards = plugin.getCards(context, coreMixins)
console.dir(cards)
```
