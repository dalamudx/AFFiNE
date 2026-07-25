# Downstream maintenance

This fork tracks upstream AFFiNE through one clean downstream branch per upstream release.

## Branches and upgrades

- Add and retain the official AFFiNE repository as the `upstream` remote.
- Create `downstream/vX.Y.Z` directly from the corresponding official `vX.Y.Z` tag.
- Reapply downstream work as small, single-purpose patches: product behavior, server configuration, and release automation.
- Before merging an upgrade, use `git range-diff` against the preceding downstream branch and enable `git rerere` to retain conflict resolutions.
- Do not merge the old downstream branch wholesale, modify official release workflows, add `.mise.toml`, or edit generated frontend native exports.

## Docker release

`.github/workflows/downstream-docker.yml` is the only downstream release workflow. It publishes multi-architecture images to:

```text
ghcr.io/dalamudx/affine:X.Y.Z
```

The workflow builds the corresponding upstream `vX.Y.Z` source tag and publishes its image under the unprefixed `X.Y.Z` version in this separate GHCR namespace. Trigger it by pushing an upstream-matching `vX.Y.Z` tag in this fork, or manually provide that tag; all build jobs, including the Docker context, check out that exact ref. The matching tag in this fork is independent of the upstream repository; never modify an upstream AFFiNE tag. `latest` changes only when the manual `publish_latest` input is selected. Do not use the official `stable`, `beta`, or `canary` image tags.

The workflow intentionally does not use upstream R2, Sentry, Perfsee, AFFiNE Pro, or GCP credentials, and does not deploy any service. Its first GitHub Actions execution is required to validate registry permissions and the multi-architecture Docker build.

## Required generated artifacts

After restoring the repository dependencies for the upstream release, run:

```bash
yarn affine @affine/i18n build
yarn affine server genconfig
```

Review and include generated i18n output together with the relevant source changes. The server command updates the self-host configuration schema and the Admin configuration data; do not hand-edit their generated output.
