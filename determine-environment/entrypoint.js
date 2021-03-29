const core = require('@actions/core');
const path = require('path');

/**
 * Run determine-env.
 *
 * Basically, set an environment variable that we can use as NODE_ENV later
 * on to distinguish between production and non-production.
 */
async function run() {
  const branch_production = core.getInput('branch_production', { required: false }) || 'main';

  // What did we just checkout?
  let ref = process.env['GITHUB_REF'];
  let branch = path.basename(ref);

  // This one we'll return.
  let env

  if (branch == branch_production) {            // On the nominated prod branch.
    env = 'production';
  } else if (ref.indexOf('/tags') > -1) {       // Dale made a tag!
    env = 'production';
  } else {                                      // Wherever you go, there you are.
    env = branch
  }

  core.exportVariable('BRANCH_ENVIRONMENT', env);
  core.setOutput('branch_environment', env);
}

run().catch(core.setFailed);
