**Notice: This utility has been discontinued. The functionality provided by this module has been merged into [jellyfish-worker](https://github.com/product-os/jellyfish-worker).**

# Jellyfish Channels Plugin

Provides a set of cards and actions for adding 'channels' functionality to Jellyfish.

# Usage

Below is an example how to use this library:

```js
import { channelsPlugin } from '@balena/jellyfish-plugin-channels';
import { PluginManager } from '@balena/jellyfish-worker';

// Load cards from this plugin
const pluginManager = new PluginManager([channelsPlugin()]);
const cards = pluginManager.getCards();
console.dir(cards);
```

# Documentation

[![Publish Documentation](https://github.com/product-os/jellyfish-plugin-channels/actions/workflows/publish-docs.yml/badge.svg)](https://github.com/product-os/jellyfish-plugin-channels/actions/workflows/publish-docs.yml)

Visit the website for complete documentation: https://product-os.github.io/jellyfish-plugin-channels
