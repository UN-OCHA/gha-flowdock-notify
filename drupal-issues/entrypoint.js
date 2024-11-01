import core from '@actions/core';
import { readdir, readFile } from 'node:fs/promises';
import axios from 'axios';

// const regex = `@see (?<link>(?:(?:[a-z]+:)?//)(?:www\\.drupal\\.org)(?:(?:[/?#][^\\s"]*[^\\s".?!])|[/])?)`;
// const regex = `@see (?<link>(?:(?:[a-z]+:)?//)(?:www\\.drupal\\.org)/project/[^\\s"]*/issues/(?<issue>[^\\s".?!]*)?)`;
const regex = `(?<link>(?:(?:[a-z]+:)?//)(?:(www\\.)?drupal\\.org)/(node|project/[^\\s"]*/issues)/(?<issue>[^\\s".?!]*)?)`;

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
  const dirs = core.getInput('source_directory', { required: true });
  const format = core.getInput('output_format', { required: false });

  // A temp list of all files.
  let fileList = [];

  for (const dir of dirs.split(/,/)) {
    try {
      let files = await readdir(dir, { recursive: true, withFileTypes: true });
      fileList = fileList.concat(files);
    } catch (err) {
      console.error(err);
    }
  }

  var issues = new Object();
  let result = '';

  // Assemble a github file link prefix if we're running on github.
  const github_link_prefix = process.env['GITHUB_SERVER_URL'] + '/' + process.env['GITHUB_REPOSITORY'] + '/blob/' + process.env['GITHUB_REF_NAME'] + '/';

  // Read each file in files and look for lines matching regex.
  for (const dirent of fileList) {
    // Are you a file?
    if (dirent.isFile()) {
      let filePath = dirent.parentPath + '/' + dirent.name;
      var contents = '';

      try {
        contents = await readFile(filePath, { encoding: 'utf8' });
      } catch (err) {
        console.error(err.message);
      }

      // Need a line counter, so we can make links.
      var count = 1;
      for (const line of contents.split(/\n/)) {
        let matches = line.match(regex);
        if (matches != null) {
          let node = matches.groups.issue;
          let fileLink = '[' + filePath + ':' + count + '](' + github_link_prefix + filePath + '#L' + count + ')';

          // Ensure we do not overwrite the issue if it is referenced in multiple files.
          if (issues[node] != null) {
            issues[node].files.push(fileLink);
          } else {
            issues[node] = {link: matches.groups.link, files: [fileLink]};
          }
        }
        count++;
      } // for line
    }
  } // for fileList

  // Assemble a list of node IDs for the API call.
  let nids = Object.keys(issues);

  if (nids != null) {
    var response;
    // Fetch all issue data.
    try {
      response = await axios.get('https://www.drupal.org/api-d7/node.json', { params: { nid: nids, sort: 'field_issue_status', direction: 'ASC' } });
    } catch (err) {
      console.error(err.message);
    }

    // How do we output?
    if (format == 'table') {
      result = '| Issue | Status | Mentions |\n';
      result += '|-------|--------|----------|\n';
      for (const node of response.data.list) {
        result += '| [' + node.title + '](' + node.url + ') | ' + issue_statuses[node.field_issue_status] + ' | ';
        var count = 1;
        for (const item of issues[node.nid].files) {
          let link = item.replace(/\[.*\]/, '');
          result += '[' + count + ']' + link + ' ';
          count++;
        }
        result += '|\n';
      }
    } else {
      for (const node of response.data.list) {
        result += '[' + node.title + '](' + node.url + '): ' + issue_statuses[node.field_issue_status] + '\n';
        result += ' * ' + issues[node.nid].files.join('\n * ') + '\n\n';
      }
    }
  } else {
    result = '\n* No issues.\n';
  }

  core.exportVariable('DRUPAL_ISSUES', result);
  core.setOutput('drupal_issues', result);
}

run().catch(core.setFailed);
