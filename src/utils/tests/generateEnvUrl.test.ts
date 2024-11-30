import { DevMode } from '@constants/env';
import { generateEnvUrl } from '@utils/generateEnvUrl';
import * as EnvModule from '@constants/env';

describe('generateEnvUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('VITE_NODE_ENV', '' as keyof DevMode);
  });

  const adminUrl = 'https://admin.youscience.com';
  const discoveryUrl = 'https://login.youscience.com';

  it('should assign window location to dev url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    const url = generateEnvUrl(adminUrl);

    expect(url).toBe('https://admin.dev.youscience.com');
  });

  it('should assign window location to sandbox url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    const url = generateEnvUrl(adminUrl);

    expect(url).toBe('https://admin.sandbox.youscience.com');
  });

  it('should assign window location to stage url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    const url = generateEnvUrl(adminUrl);

    expect(url).toBe('https://admin.stage.youscience.com');
  });

  it('should assign window location to production url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'prod' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('prod');

    const url = generateEnvUrl(adminUrl);

    expect(url).toBe(adminUrl);
  });

  it('should return the provided url if it includes seamless', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    const url = generateEnvUrl('https://seamlesswbl.com');

    expect(url).toBe('https://seamlesswbl.com');
  });

  it('should assign window location when url includes stage environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    const url = generateEnvUrl('https://admin.stage.youscience.com');

    expect(url).toBe('https://admin.stage.youscience.com');
  });

  it('should assign window location when url includes dev environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    const url = generateEnvUrl('https://admin.dev.youscience.com');

    expect(url).toBe('https://admin.dev.youscience.com');
  });

  it('should assign window location when url includes sandbox environment mode', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    const url = generateEnvUrl('https://admin.sandbox.youscience.com');

    expect(url).toBe('https://admin.sandbox.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'dev' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('dev');

    const url = generateEnvUrl(discoveryUrl);

    expect(url).toBe('https://login.dev.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'sandbox' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('sandbox');

    const url = generateEnvUrl(discoveryUrl);

    expect(url).toBe('https://login.sandbox.youscience.com');
  });

  it('should assign window location when url includes discovery url', async () => {
    vi.stubEnv('VITE_NODE_ENV', 'stage' as keyof DevMode);
    vi.spyOn(EnvModule, 'DEV_MODE', 'get').mockReturnValue('stage');

    const url = generateEnvUrl('https://login.youscience.com/admin/users/0189eab7-3145');

    expect(url).toBe('https://login.stage.youscience.com/admin/users/0189eab7-3145');
  });
});
