# GitHub Actions Workflows

## Playwright Tests Workflow

Automated test execution pipeline for Playwright tests.

### Triggers
- **Push**: Runs on pushes to `main`, `master`, or `develop` branches
- **Pull Request**: Runs on PRs targeting `main`, `master`, or `develop`
- **Schedule**: Daily execution at 2 AM UTC
- **Manual**: Can be triggered manually via GitHub UI

### Features
- **Parallel Execution**: Tests run in 4 parallel shards for faster execution
- **Browser Support**: Runs on Chromium (configurable for other browsers)
- **Artifacts**: Automatically uploads test reports and traces
- **Report Merging**: Combines shard reports into single HTML report

### Configuration
- Timeout: 60 minutes per job
- Node.js: Version 20
- Runner: Ubuntu latest

### Artifacts
- **Test Reports**: HTML reports retained for 30 days
- **Trace Files**: Uploaded on failure, retained for 30 days
