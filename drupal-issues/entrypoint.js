import core from '@actions/core';
import { readdir, readFile } from 'node:fs/promises';
import axios from 'axios';

// const regex = `@see (?<link>(?:(?:[a-z]+:)?//)(?:www\\.drupal\\.org)(?:(?:[/?#][^\\s"]*[^\\s".?!])|[/])?)`;
const regex = `@see (?<link>(?:(?:[a-z]+:)?//)(?:www\\.drupal\\.org)/project/[^\\s"]*/issues/(?<issue>[^\\s".?!]*)?)`;

// @see https://www.drupal.org/drupalorg/docs/apis/rest-and-other-apis
const issue_statuses = {
  1: 'active',
  2: 'fixed',
  3: 'closed (duplicate)',
  4: 'postponed',
  5: 'closed (won\'t fix)',
  6: 'closed (works as designed)',
  7: 'closed (fixed)',
  8: 'needs review',
  13: 'needs work',
  14: 'reviewed & tested by the community',
  15: 'patch (to be ported)',
  16: 'postponed (maintainer needs more info)',
  17: 'closed (outdated)',
  18: 'closed (cannot reproduce)',
};


/**
 * Run drupal-issues.
 */
async function run() {
  const dir = core.getInput('source_directory', { required: true });

  // A temp list of all files.
  let fileList = [];

  try {
    fileList = await readdir(dir, { recursive: true, withFileTypes: true });
  } catch (err) {
    console.error(err);
  }

  var issues = new Array(0);
  var output = new Array(0);
  let result = '';

  // Read each file in files and look for lines matching regex.
  for (const dirent of fileList) {
    // Are you a file?
    if (dirent.isFile()) {
      let filePath = dirent.parentPath + '/' + dirent.name;
      let contents;

      try {
        contents = await readFile(filePath, { encoding: 'utf8' });
      } catch (err) {
        console.error(err.message);
      }

      for (const line of contents.split(/\n/)) {
        const matches = line.match(regex);
        if (matches != null) {
          issues.push(matches.groups.issue);
        }
      } // for line

      if (issues.length) {
        output.push({ file: dirent.name, path: filePath, issues: issues});
      }
    }
  } // for fileList

  // Hit up drupal.org for a summary of all these issues.
  // The assumptioon here is that we found 100 or less :-)
  try {
    const response = await axios.get('https://www.drupal.org/api-d7/node.json', { params: { nid: issues, sort: 'field_issue_status', direction: 'ASC' } });
    for (const node of response.data.list) {
      result += '* [' + node.title + '](' + node.url + '): ' + issue_statuses[node.field_issue_status] + '\n';
    }
  } catch (err) {
    console.error(err.message);
  }

  core.exportVariable('DRUPAL_ISSUES', result);
  core.setOutput('drupal_issues', result);
}

run().catch(core.setFailed);
