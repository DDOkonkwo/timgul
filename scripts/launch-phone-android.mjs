import { execSync, spawn } from 'node:child_process';

const port = process.argv[2] ?? '8081';
const avdName = process.argv[3] ?? 'Pixel_10_Pro';
const scheme = 'timgul';
const metroUrl = encodeURIComponent(`http://localhost:${port}`);
const devClientUrl = `${scheme}://expo-development-client/?url=${metroUrl}`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function listOnlineDevices() {
  const output = execSync('adb devices', { encoding: 'utf8' });
  return output
    .split('\n')
    .slice(1)
    .map((line) => line.trim().split(/\s+/))
    .filter((parts) => parts[0] && parts[1] === 'device')
    .map((parts) => parts[0]);
}

async function waitForOnlineDevice(timeoutMs = 120000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const devices = listOnlineDevices();
    if (devices.length > 0) {
      return devices[0];
    }
    await sleep(3000);
  }
  throw new Error('Timed out waiting for phone emulator to boot.');
}

async function waitForMetro(timeoutMs = 60000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/status`);
      if (response.ok) {
        console.log(`Metro is ready on port ${port}`);
        return;
      }
    } catch {
      // Metro not up yet
    }
    await sleep(2000);
  }
  throw new Error(
    `Metro is not responding on port ${port}. Run "npm run start:lan" first and wait for it to start.`,
  );
}

async function main() {
  await waitForMetro();

  let devices = listOnlineDevices();

  if (devices.length === 0) {
    console.log(`Starting phone emulator: ${avdName}`);
    spawn('emulator', ['-avd', avdName], {
      detached: true,
      stdio: 'ignore',
    }).unref();
    devices = [await waitForOnlineDevice()];
  } else if (devices.length > 1) {
    console.log(`Multiple emulators online. Using first: ${devices[0]}`);
  }

  const device = devices[0];
  console.log(`Phone device: ${device}`);

  execSync(`adb -s ${device} reverse --remove-all`, { stdio: 'ignore' });
  execSync(`adb -s ${device} reverse tcp:${port} tcp:${port}`, { stdio: 'inherit' });
  console.log(`Launching Timgul on ${device} (Metro port ${port})`);
  execSync(
    `adb -s ${device} shell am start -a android.intent.action.VIEW -d "${devClientUrl}"`,
    { stdio: 'inherit' },
  );

  console.log('Done.');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
