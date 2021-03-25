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

# Documentation

[![Publish Documentation](https://github.com/product-os/jellyfish-plugin-channels/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/product-os/jellyfish-plugin-channels/actions/workflows/publish-docs.yml)

Visit the website for complete documentation: https://product-os.github.io/jellyfish-plugin-channels
