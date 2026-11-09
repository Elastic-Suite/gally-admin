# gally-admin - agent guide

This repo (`Elastic-Suite/gally-admin`) holds the back-office component library, the shared
library and the storefront SDK. It is usually checked out inside the Gally monorepo at
`front/gally-admin`, as its own git repo: commit here, not in the monorepo. The monorepo map is
`../../AGENTS.md`.

The back-office application itself, `front/pwa` in the monorepo, is almost empty: each page in
`pwa/pages/` re-exports a page component from this repo. **To change back-office behaviour or UI,
edit this repo, not `pwa`.** The URL list and the pwa side are in the monorepo's
`front/pwa/AGENTS.md`.

## Packages

Lerna + yarn workspaces, published to npm as `@elastic-suite/*`.

- `packages/components` -> `@elastic-suite/gally-admin-components`
  - `src/components/` is organised atomic-design style: `atoms/`, `molecules/`, `organisms/`, plus
    `stateful/`, `stateful-layout/`, `stateful-pages/`, `stateful-providers/`.
  - `src/pages/admin/` holds the page components that `pwa/pages` re-exports.
  - Also `hooks/`, `hocs/`, `contexts/`, `services/`, `store/`, `utils/`, `constants/`.
  - `public/locales` and `public/images` are symlinked into `pwa/public` by pwa's `prepare` script.
  - Storybook lives here (`yarn build:storybook`).
- `packages/shared` -> `@elastic-suite/gally-admin-shared`
  - Framework-agnostic: `hooks/`, `services/`, `types/`, `utils/`, `contexts/`, `constants/`,
    `mocks/`.
  - **The API, JSON-LD and Hydra types and the fetch layer live here.**
- `packages/sdk` -> `@elastic-suite/gally-sdk`, the public storefront SDK
  - `src/client/` (`Client`, `Configuration`, `TokenCacheManager`), `src/entity/` (Catalog,
    LocalizedCatalog, Metadata, SourceField...), `src/repository/`, `src/graphql/`,
    `src/service/` (`SearchManager`, `TrackingEventManager`, `StructureSynchronizer`,
    `IndexOperation`), `src/validator/`.
  - Built with tsup, tested with vitest (`tests/unit`, `tests/integration`).
  - The monorepo's `front/example-app` consumes it: an SDK change can break the demo storefront.

## Checks

The monorepo's `make qa` does **not** lint or type-check anything in this repo. Run the scripts
from `package.json` yourself, inside the monorepo's `pwa` container, which mounts `front/` at
`/usr/src/front`:

```bash
docker compose exec pwa yarn --cwd gally-admin typescript
docker compose exec pwa yarn --cwd gally-admin eslint:ci
docker compose exec pwa yarn --cwd gally-admin prettier:ci
docker compose exec pwa yarn --cwd gally-admin test       # shared + components (jest)
docker compose exec pwa yarn --cwd gally-admin test:sdk   # sdk (vitest)
```

- `eslint` and `prettier` without `:ci` **rewrite files** (`eslint --fix`). Use the `:ci` scripts
  to only report.
- `yarn test` does not run the SDK tests. Use `test:sdk` for those.
- Scope to one package with `--cwd gally-admin/packages/<package>`.
- Commits must follow conventional commits: commitlint runs from this repo's husky hooks.

The `gally-dev` skill has the full change-to-check table for the monorepo.

## Architecture decisions

Decisions are recorded as ADRs in `docs/decisions/`, in MADR 4 format, with one folder per topic.
`docs/decisions/README.md` explains the rules and lists every ADR.

- Before changing an area, read the ADRs in its topic folder. If a change goes against one, say
  so instead of quietly going around it.
- When a change meets the four questions in `docs/decisions/README.md`, suggest an ADR. Write it
  only when asked.
- ADRs are written for people first. Keep them in plain language. Do not add agent instructions,
  file inventories or anything a person reviewing the ADR does not need.
- Copy `docs/decisions/adr-template.md` for a new ADR, and never edit the template itself.
