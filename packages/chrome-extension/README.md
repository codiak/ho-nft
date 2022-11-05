# HO NFT

My humble opionion of this NFT ...
The application consists of a chrome extension and set of smart contracts that allow users to annotate and read review on NFTs.

## Features

- Embed reviews listed on NFT platforms: OpenSea
- Write reviews on NFTs

## Chrome Extension Installation

```sh
cd packages/chrome-extension
yarn
yarn dev
```

Builds the dev release in the `dist` folder. Navigate to `chrome://extensions`, click on **Load Unpacked** and select the `dist` folder to install the extension. Navigate to opensea.io, select a collection, scroll to view NFTs and wait for 3s to see a row injected in NFTs that shows sentiment and number of reviews.

Code changes deploy automatically, click on the **🔄** icon on the extension page to propagae changes to the extension.

```sh
yarn build
```

Builds the production release in the `dist` folder.
