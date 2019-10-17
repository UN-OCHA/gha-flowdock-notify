> **⚠️ Note:** To use this GitHub Action, you must have access to GitHub Actions. GitHub Actions are currently only available in public beta (you must apply for access).

This action is a modified version of the Slack Notify action, which is part of [GitHub Actions Library](https://github.com/rtCamp/github-actions-library/) created by [rtCamp](https://github.com/rtCamp/).

# Flowdock Notify - GitHub Action

A [GitHub Action](https://github.com/features/actions) to send a message to a Flowdock channel.

## Usage

You can use this action after any other action. Here is an example setup of this action:

1. Create a `.github/workflows/flowdock-notify.yml` file in your GitHub repo.
2. Add the following code to the `flowdock-notify.yml` file.

```yml
on: push
name: Flowdock Notification Demo
jobs:
  flowdockNotification:
    name: Flowdock Notification
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Flowdock Notification
      uses: UN-OCHA/actions/flowdock-notify@master
      env:
        FLOWDOCK_TOKEN: ${{ secrets.FLOWDOCK_TOKEN }}
```

3. Create `FLOWDOCK_TOKEN` secret using [GitHub Action's Secret](https://developer.github.com/actions/creating-workflows/storing-secrets).


## Environment Variables

By default, action is designed to run with minimal configuration but you can alter Slack notification using following environment variables:

Variable          | Default                                               | Purpose
------------------|-------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------
FLOWDOCK_USERNAME | `fdBot`                                               | The name of the sender of the message. Does not need to be a "real" username
FLOWDOCK_ICON     | Empty                                                 | The emoji name to prepend to the message. Exclude the surrounding colons
FLOWDOCK_THREAD   | Empty                                                 | The thread ID you wnt to post the message to
FLOWDOCK_MESSAGE  | Generated from git commit message.                    | The main Flowdock message.
FLOWDOCK_TAGS     | Empty                                                 | Hash tags to tag the message

You can see the action block with all variables as below:

```yml
    - name: Flowdock Notification
      uses: UN-OCHA/actions/flowdock-notify@master
      env:
        FLOWDOCK_USERNAME: 'Jebb'
        FLOWDOCK_ICON: 'rocket'
        FLOWDOCK_THREAD: 'Owc8UJJ5773F-PIdEwK8LtT5QM7'
        FLOWDOCK_MESSAGE: 'Hi there, humans'
        FLOWDOCK_TAGS: 'lol,spam'
        FLOWDOCK_TOKEN: ${{ secrets.FLOWDOCK_TOKEN }}
```

All Flowdock markup is supported in messages.

## Hashicorp Vault (Optional)

This GitHub action supports [Hashicorp Vault](https://www.vaultproject.io/).

To enable Hashicorp Vault support, please define following GitHub secrets:

Variable      | Purpose                                                                       | Example Vaule
--------------|-------------------------------------------------------------------------------|-------------
`VAULT_ADDR`  | [Vault server address](https://www.vaultproject.io/docs/commands/#vault_addr) | `https://example.com:8200`
`VAULT_TOKEN` | [Vault token](https://www.vaultproject.io/docs/concepts/tokens.html)          | `s.gIX5MKov9TUp7iiIqhrP1HgN`

You will need to change `secrets` line in `flowdock-notify.yml` file to look like below.

```yml
on: push
name: Flowdock Notification Demo
jobs:
  flowdockNotification:
    name: Flowdock Notification
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@master
    - name: Flowdock Notification
      uses: UN-OCHA/actions/flowdock-notify@master
      env:
        VAULT_ADDR: ${{ secrets.VAULT_ADDR }}
        VAULT_TOKEN: ${{ secrets.VAULT_TOKEN }}
```

GitHub action uses `VAULT_TOKEN` to connect to `VAULT_ADDR` to retrieve Flowdock token from Vault.

In the Vault, the Flowdock token should be setup as field `token` on path `secret/flowdock`.

## License

[MIT](LICENSE) © 2019 UN-OCHA
