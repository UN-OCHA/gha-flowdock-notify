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
  const docker_image = core.getInput('docker_image', { required: false }) || '';

  // This one we'll return.
  let php_version
  let php_major
  let php_minor
  let php_patch

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

  // Catch the version and see if we sub-divide that some.
  const regexp = 'FROM (?<image>.*' + docker_image.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '):(?<tag>(?<version>(?<major>\\d+)\.(?<minor>\\d+)(\.(?<patch>\\d+))?).*)'

  // Check each line.
  data.split("\n").forEach(line => {
    if (line.indexOf(docker_image) > -1) {
      try {
        let matches = line.match(regexp).groups
        php_version = matches.version
        php_major = matches.major
        php_minor = matches.minor
        php_patch = matches.patch
      } catch(err) {}
    }
  })

  // So much output.
  core.exportVariable('PHP_VERSION', php_version);
  core.exportVariable('PHP_VERSION_MAJOR', php_major);
  core.exportVariable('PHP_VERSION_MINOR', php_minor);
  core.exportVariable('PHP_VERSION_PATCH', php_patch);
  core.setOutput('php_version', php_version);
  core.setOutput('php_version_major', php_major);
  core.setOutput('php_version_minor', php_minor);
  core.setOutput('php_version_patch', php_patch);
}

run().catch(core.setFailed);
