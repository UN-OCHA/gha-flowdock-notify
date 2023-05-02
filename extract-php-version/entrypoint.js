const core = require('@actions/core');
const fs = require('fs');

/**
 * Run determine-env.
 *
 * Basically, set an environment variable that we can use as NODE_ENV later
 * on to distinguish between production and non-production.
 */
async function run() {
  const docker_file  = core.getInput('docker_file',  { required: false }) || 'Dockerfile';
  const docker_image = core.getInput('docker_image', { required: false }) || 'php';

  // This one we'll return.
  let php_version

  // This will hold the file contents.
  let data

  if (!fs.existsSync(docker_file)) {
    return;
  }

  try {
    data = fs.readFileSync(docker_file, 'utf8');
  } catch (err) {
    return;
  }

  let regexp = 'FROM .*' + docker_image + ':(?<version>([89]\.[0-9])).*'

  // Check each line.
  data.split("\n").forEach(line => {
    if (line.indexOf(docker_image) > -1) {
      try {
        let matches = line.match(regexp).groups
        php_version = matches.version
      } catch(err) {}
    }
  })

  core.exportVariable('PHP_VERSION', php_version);
  core.setOutput('php_version', php_version);
}

run().catch(core.setFailed);
