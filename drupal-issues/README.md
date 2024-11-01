# Drupal Issues GitHub Action

Scans source code for Drupal Issue links in the form `@see https://www.drupal.org/project/[project]/issues/[number]` and retrieves the status for each issue using the [drupal.org REST API](https://www.drupal.org/drupalorg/docs/apis/rest-and-other-apis). It creates a snippet of markdown that contains a list of all found issues and their current status. This allows a developer to see if any references issue has been closed, which may mean they can remove a work-around or patch.

## Usage

To integrate Drupal Issues with your Actions pipeline, specify the name of this repository with a tag number as a `step` within your `workflow.yml` file. Optionally, you can choose to include an additional input to specify which code directory to inspect.

Inside your `.github/workflows/workflow.yml` file:

```yaml
steps:
- uses: actions/checkout@master
- uses: UN-OCHA/actions/drupal-issues-main
  with:
    source_directory: docroot/modules/custom,docroot,themes,custom
```

## Arguments

`source_directory` : specifies a comma delimited list of directories relative to the repository root in which the action will look for Drupal issue links.
`output_format`: specifies the markdown snippet. Can be `table` for a formatted table or anyhting else for a list.

## Output

This action sets the DRUPAL_ISSUES environment variable and provides an outputs.drupal_issues variable.

## License
