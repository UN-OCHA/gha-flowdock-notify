# actions
UN-OCHA shared GitHub Actions

These automagically build and become available at https://hub.docker.com/repository/docker/unocha/actions/general when you make a new tag.


## determine-environment

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Determine the environment type for asset builds
      uses: docker://unocha/actions:determine-environment-latest
```

## flowdock-notify

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Flowdock Notify
      uses: docker://unocha/actions:flowdock-notify-latest
      env:
        FLOWDOCK_TOKEN: ${{ secrets.FLOWDOCK_TOKEN }}
        FLOWDOCK_ICON: 'package'
        FLOWDOCK_MESSAGE: 'Hey, ${{ git.hub.actor}} made me do a thing!'
        FLOWDOCK_TAGS: 'build,docker,${{ github.actor }}'
```

## drupal-docker-build

``yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Checkout code
      id: checkout
      uses: actions/checkout@v1
      with:
        fetch-depth: 0
    - name: Build The Thing
      id: build-action
      uses: UN-OCHA/actions/drupal-docker-build@main
      with:
        aws_access_key_id: ${{ secrets.ECR_AWS_ACCESS_KEY_ID }}
        aws_secret_access_key: ${{ secrets.ECR_AWS_ACCESS_KEY_ID }}
        docker_registry_url: public.ecr.aws/unocha
        docker_image: drupal-site
        ecr_github_token: ${{ secrets.ECR_GITHUB_TOKEN }}
        ecr_jenkins_token: ${{ secrets.JENKINS_ECR_TOKEN }}
        slack_bot_token: ${{ secrets.SLACK_BOT_TOKEN }}
        slack_channel_name: ${{ secrets.SLACK_CHANNEL }}
        flowdock_token:  ${{ secrets.FLOWDOCK_TOKEN }}
```

## composer-update

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - name: Update The Thing
      id: update-action
      uses: UN-OCHA/actions/composer-update@main
      with:
        github_access_token: ${{ secrets.PAT }}
        patch_branch: 'develop'
        patch_packages: 'drupal/*'
        patch_maintainers: ${{ secrets.DRUPAL_MAINTAINERS }}
        slack_bot_token: ${{ secrets.SLACK_BOT_TOKEN }}
        slack_channel_name: ${{ secrets.SLACK_CHANNEL }}
        flowdock_token: ${{ secrets.FLOWDOCK_TOKEN }}
```
