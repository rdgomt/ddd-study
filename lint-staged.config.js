/* eslint-disable perfectionist/sort-objects */

module.exports = {
  '*': ['yarn prettify'],
  '**/*.{ts,tsx}': ['yarn check-spell', 'yarn lint'],
  '**/*': ["bash -c 'yarn check-types'", "bash -c 'yarn test'", "bash -c 'yarn test:e2e'"],
}
