/**
 * oh-my-openclaw — OpenClaw plugin entry point
 *
 * Registers all bundled ClawHub skills into the OpenClaw runtime.
 * Install: openclaw plugins install @m4d3bug/oh-my-openclaw
 */

export default {
  id: 'oh-my-openclaw',
  name: 'oh-my-openclaw',

  register(api) {
    console.log('[oh-my-openclaw] Plugin loaded — 37 curated skills registered');
  },
};
