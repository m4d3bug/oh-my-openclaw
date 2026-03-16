/**
 * oh-my-openclaw skills registry
 * All skills are validated by AgentGuard before registration.
 */

import autopilot from './autopilot.js';
import selfImprovingAgent from './self-improving-agent/index.js';

export const skills = [
  autopilot,
  selfImprovingAgent,
];

export default skills;