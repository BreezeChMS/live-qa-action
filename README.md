# live-qa-action
Spin up a live branch link for QA!
Used in conjunction with [live-qa-app](https://github.com/BreezeChMS/live-qa-app)

## Required Parameters
- `token` = Point to a GitHub token with environment access (GITHUB.TOKEN does work)
- `url` = Point to the URL for this action step

## Example Usage

### Create Environment
```yaml
name: Build Live QA Environment

on:
  pull_request:
    types: [opened]

jobs:
  live_qa:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Pull Request Branch
        uses: actions/checkout@v2

      - uses: https://github.com/BreezeChMS/live-qa-action
        with:
          token: ${{ GITHUB.TOKEN }}
          url: http://hopingthis.works:9000/hooks/new
```

### Update/Sync Environment
```yaml
name: Update Live QA Environment

on:
  pull_request:
    types: [synchronize]

jobs:
  live_qa:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Pull Request Branch
        uses: actions/checkout@v2

      - uses: https://github.com/BreezeChMS/live-qa-action
        with:
          token: ${{ GITHUB.TOKEN }}
          url: http://hopingthis.works:9000/hooks/sync
```

### Delete Environment
```yaml
name: Delete Live QA Environment

on:
  pull_request:
    types: [closed]

jobs:
  live_qa:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Pull Request Branch
        uses: actions/checkout@v2

      - uses: https://github.com/BreezeChMS/live-qa-action
        with:
          token: ${{ GITHUB.TOKEN }}
          url: http://hopingthis.works:9000/hooks/delete
```
