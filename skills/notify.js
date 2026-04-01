/**
 * notify skill — cross-channel notifications from agent completions
 *
 * Sends completion notifications back through configured openclaw channels.
 * Usage: imported by other skills, not invoked directly.
 *
 * Also exposes /notify for manual pings:
 *   /notify <message>
 */

export default {
  name: 'notify',
  version: '1.0.0',
  description: 'Cross-channel notification helper',
  commands: ['/notify'],

  /**
   * Send a notification through all configured channels.
   * Can be called programmatically by other skills.
   */
  async send(openclaw, message, opts = {}) {
    const channels = opts.channels ?? openclaw.config?.notifyChannels ?? [];
    const results = await Promise.allSettled(
      channels.map(ch => openclaw.send({ channel: ch, text: message }))
    );
    return results;
  },

  async handler(ctx) {
    const { message, openclaw } = ctx;
    const text = message.text.replace(/^\/notify\s*/i, '').trim();
    if (!text) return ctx.reply('Usage: /notify <message>');

    await this.send(openclaw, text);
    return ctx.reply('Notification sent.');
  },
};
