import * as core from '@actions/core';
import * as exec from '@actions/exec';
import glob from 'glob';  
import { Formatter } from './formatter';

async function run() {
  try {
    const version = core.getInput('version', { required: true });
    const dir = core.getInput('dir');
    const pattern = core.getInput('pattern');

    const formatter = new Formatter(version);
    const jar = await formatter.getJar();
    const files = glob.sync(`${dir}/${pattern}`)
    await exec.exec('java', ['-jar', jar, '--dry-run', '--set-exit-if-changed', ...files])
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();