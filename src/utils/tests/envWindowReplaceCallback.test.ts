/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { DevMode } from '@constants/env';
import { envWindowReplaceCallback } from '@utils/envWindowReplaceCallback';
import * as EnvModule from '@constants/env';

describe('envWindowReplaceCallback', () => {
  const { location } = window;

  beforeAll(() => {
    if (window) {
      delete (window as any).location;
      (window as any).location = {
        assign: vi.fn(),
      };
    }
  });

  afterAll(() => {
    window.location = location;
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_NODE_ENV', '' as keyof DevMode);
  });

  const adminUrl = 'https://admin.youscience.com';
  const discoveryUrl = 'https://login.youscience.com';

  it('should assign window location to dev url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    envWindowReplaceCallback(adminUrl);

    expect(window.location.assign).toBeCalledWith('https://admin.dev.youscience.com');
  });

  it('should assign window location to sandbox url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    envWindowReplaceCallback(adminUrl);

    expect(window.location.assign).toBeCalledWith('https://admin.sandbox.youscience.com');
  });

  it('should assign window location to stage url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    envWindowReplaceCallback(adminUrl);

    expect(window.location.assign).toBeCalledWith('https://admin.stage.youscience.com');
  });

  it('should assign window location to production url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'prod' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('prod');

    envWindowReplaceCallback(adminUrl);

    expect(window.location.assign).toBeCalledWith(adminUrl);
  });

  it('should return the provided url if it includes seamless', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    envWindowReplaceCallback('https://seamlesswbl.com');

    expect(window.location.assign).toBeCalledWith('https://seamlesswbl.com');
  });

  it('should assign window location when url includes stage environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    envWindowReplaceCallback('https://admin.stage.youscience.com');

    expect(window.location.assign).toBeCalledWith('https://admin.stage.youscience.com');
  });

  it('should assign window location when url includes dev environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    envWindowReplaceCallback('https://admin.dev.youscience.com');

    expect(window.location.assign).toBeCalledWith('https://admin.dev.youscience.com');
  });

  it('should assign window location when url includes sandbox environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    envWindowReplaceCallback('https://admin.sandbox.youscience.com');

    expect(window.location.assign).toBeCalledWith('https://admin.sandbox.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    envWindowReplaceCallback(discoveryUrl);

    expect(window.location.assign).toBeCalledWith('https://login.dev.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    envWindowReplaceCallback(discoveryUrl);

    expect(window.location.assign).toBeCalledWith('https://login.sandbox.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    envWindowReplaceCallback('https://login.youscience.com/admin/users/0189eab7-3145');

    expect(window.location.assign).toBeCalledWith('https://login.stage.youscience.com/admin/users/0189eab7-3145');
  });
});
