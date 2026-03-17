/**
 * team skill — multi-agent team mode
 *
 * Usage in openclaw chat:
 *   /team <task>
 *
 * Spawns a coordinated team of agents that work in parallel,
 * then synthesizes their outputs.
 *
 * Pipeline: plan → parallel exec → review → fix → deliver
 */

export default {
  name: 'team',
  version: '1.0.0',
  description: 'Parallel multi-agent team for complex tasks',
  commands: ['/team'],

  async handler(ctx) {
    const { message, openclaw } = ctx;
    const task = message.text.replace(/^\/team\s*/i, '').trim();

    if (!task) {
      return ctx.reply('Usage: /team <task description>');
    }

    await ctx.reply(`Team assembled for: *${task}*`);

    // Plan
    const prd = await openclaw.agent('product', {
      prompt: `Write a short PRD for: ${task}`,
    });

    // Parallel execution
    const [backendResult, frontendResult, devopsResult] = await Promise.all([
      openclaw.agent('backend',  { prompt: `Implement backend for: ${task}\nPRD:\n${prd}` }),
      openclaw.agent('frontend', { prompt: `Implement frontend for: ${task}\nPRD:\n${prd}` }),
      openclaw.agent('devops',   { prompt: `Set up infrastructure for: ${task}\nPRD:\n${prd}` }),
    ]);

    // Security + test in parallel
    const [securityResult, testResult] = await Promise.all([
      openclaw.agent('security', {
        prompt: `Security review the following implementation:\nBackend:\n${backendResult}\nFrontend:\n${frontendResult}`,
      }),
      openclaw.agent('tester', {
        prompt: `Write tests for:\nBackend:\n${backendResult}\nFrontend:\n${frontendResult}`,
      }),
    ]);

    // Final review
    const review = await openclaw.agent('reviewer', {
      prompt: `Code review the full implementation.\nBackend:\n${backendResult}\nFrontend:\n${frontendResult}\nSecurity:\n${securityResult}`,
    });

    const summary = [
      '## Team Delivery\n',
      '### Backend\n', backendResult,
      '### Frontend\n', frontendResult,
      '### DevOps\n', devopsResult,
      '### Tests\n', testResult,
      '### Security\n', securityResult,
      '### Review\n', review,
    ].join('\n');

    await ctx.reply(summary);
  },
};
