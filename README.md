# @metamask/template-snap-monorepo

This repository contains the Metamask Aura Connect Snap. For detailed
instructions, see [the MetaMask documentation](https://docs.metamask.io/guide/snaps.html#serving-a-snap-to-your-local-environment).

Aura Connect is an unofficial, community built and fully open source AdEx Aura integration for MetaMask. It let's you explore personalized DeFi insights and wallet-based recommendations through Aura’s public APIs for your MetaMask accounts.

## AdEx Aura is not affiliated with the Aura Connect snap

AdEx AURA is your personal AI agent framework, generating secure and high-impact DeFi strategy recommendations.
For more insights into how AdEx Aura works see: [Introducing AdEx Aura](https://www.adex.network/blog/introducing-adex-aura/)

## Getting Started

Clone the repository and set up the development environment:

```shell
yarn install && yarn start
```

## Cloning

This repository contains GitHub Actions that you may find useful, see
`.github/workflows` and [Releasing & Publishing](https://github.com/MetaMask/template-snap-monorepo/edit/main/README.md#releasing--publishing)
below for more information.

If you clone or create this repository outside the MetaMask GitHub organization,
you probably want to run `./scripts/cleanup.sh` to remove some files that will
not work properly outside the MetaMask GitHub organization.

If you don't wish to use any of the existing GitHub actions in this repository,
simply delete the `.github/workflows` directory.

## Contributing

### Testing and Linting

Run `yarn test` to run the tests once.

Run `yarn lint` to run the linter, or run `yarn lint:fix` to run the linter and
fix any automatically fixable issues.

### Using NPM packages with scripts

Scripts are disabled by default for security reasons. If you need to use NPM
packages with scripts, you can run `yarn allow-scripts auto`, and enable the
script in the `lavamoat.allowScripts` section of `package.json`.

See the documentation for [@lavamoat/allow-scripts](https://github.com/LavaMoat/LavaMoat/tree/main/packages/allow-scripts)
for more information.
