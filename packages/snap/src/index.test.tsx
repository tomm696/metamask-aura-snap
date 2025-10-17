import { expect } from '@jest/globals';
import type { SnapConfirmationInterface } from '@metamask/snaps-jest';
import { installSnap } from '@metamask/snaps-jest';

describe('onRpcRequest', () => {
  describe('hello', () => {
    it('shows a confirmation dialog', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const response = request({
        method: 'chooseAccount',
        origin,
      });

      const ui = (await response.getInterface()) as SnapConfirmationInterface;
      await ui.ok();

      expect(ui.id).toBeTruthy();
      expect(ui.content).toBeTruthy();
    });
  });

  it('throws an error if the requested method does not exist', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });
  });
});
