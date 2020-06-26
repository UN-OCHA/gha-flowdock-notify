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
