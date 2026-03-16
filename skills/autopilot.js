/**
 * autopilot skill — autonomous task execution
 *
 * Usage in openclaw chat:
 *   /autopilot <task description>
 *
 * Breaks a task into steps, assigns each to the right agent,
 * executes sequentially, and reports back.
 */

export default {
  name: 'autopilot',
  version: '1.0.0',
  description: 'Autonomous multi-step task execution with agent routing',
  commands: ['/autopilot', '/ap'],

  async handler(ctx) {
    const { message, openclaw, agents } = ctx;
    const task = message.text.replace(/^\/(autopilot|ap)\s*/i, '').trim();

    if (!task) {
      return ctx.reply('Usage: /autopilot <task description>');
    }

    await ctx.reply(`Starting autopilot for: *${task}*`);

    // 1. Plan phase — architect agent breaks the task into steps
    const plan = await openclaw.agent('architect', {
      prompt: `Break this task into concrete sub-tasks and assign each to the best agent.
Agents available: architect, backend, frontend, devops, researcher, reviewer, tester, product, security, data.
Task: ${task}
Output as JSON: { steps: [{ id, agent, instruction }] }`,
      format: 'json',
    });

    const steps = plan.steps ?? [];
    await ctx.reply(`Plan: ${steps.length} steps`);

    const results = [];

    // 2. Execute phase — run each step with the assigned agent
    for (const step of steps) {
      await ctx.reply(`[${step.id}/${steps.length}] ${step.agent}: ${step.instruction}`);
      const result = await openclaw.agent(step.agent, {
        prompt: step.instruction,
        context: results,
      });
      results.push({ step, result });
    }

    // 3. Verify phase — reviewer agent checks the output
    const review = await openclaw.agent('reviewer', {
      prompt: `Review the following autopilot execution results and flag any issues.\n${JSON.stringify(results, null, 2)}`,
    });

    await ctx.reply(`Autopilot complete.\n\nReview:\n${review}`);
  },
};
