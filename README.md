# Setup Parallel Works CLI

A GitHub Action that installs the Parallel Works CLI tool on GitHub Actions runners.

## Usage

```yaml
steps:
  - name: Setup Parallel Works CLI
    uses: parallelworks/actions-setup-pw@v1
    with:
      version: latest # optional, defaults to latest

  - name: Use Parallel Works CLI
    run: pw --version
```

## Inputs

| Input     | Description                                  | Required | Default  |
| --------- | -------------------------------------------- | -------- | -------- |
| `version` | Version of the Parallel Works CLI to install | No       | `latest` |

## Outputs

| Output    | Description                                     |
| --------- | ----------------------------------------------- |
| `pw-path` | Path to the installed Parallel Works CLI binary |

## Supported Platforms

This action supports the following platforms:

- Linux (amd64, arm64)
- macOS (amd64, arm64)
- Windows (amd64, arm64)

## Development

To build this action locally:

```bash
pnpm install
pnpm run build
```

## License

MIT
