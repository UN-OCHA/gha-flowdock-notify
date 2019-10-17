# Composer Install GitHub Action

## Usage

To integrate Composer Install with your Actions pipeline, specify the name of this repository with a tag number as a `step` within your `workflow.yml` file. Optionally, you can choose to include two additional inputs to customize install command.

Inside your `.github/workflows/workflow.yml` file:

```yaml
steps:
- uses: actions/checkout@master
- uses: UN-OCHA/actions/composer-install@v2
  with:
    file: composer.json #optional
    args: --no-dev #optional
```

## Arguments

Codecov's Action currently supports four inputs from the user: `token`, `file`, `flags`, and `name`.  These inputs, along with their descriptions and usage contexts, are listed in the table below: 

| Input  | Description | | Default | Usage |
| :---:     |     :---:   |    :---:   |   :--:   |
| `file`  | Name of the package file to be processed | composer.json | Optional
| `args`  | Additional arguments for the install command |  | Optional

## Contributing

## License
