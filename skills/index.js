/**
 * oh-my-openclaw skills registry
 * All skills are validated by AgentGuard before registration.
 */

import autopilot from './autopilot.js';
import team from './team.js';
import git from './git.js';
import code from './code.js';
import notify from './notify.js';

export const skills = [
  autopilot,
  team,
  git,
  code,
  notify,
];

export default skills;
