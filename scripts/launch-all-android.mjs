import { execSync } from 'node:child_process';

const port = process.argv[2] ?? '8083';
const scheme = 'timgul';
// With adb reverse, emulator localhost maps to host Metro.
const metroUrl = encodeURIComponent(`http://localhost:${port}`);
const devClientUrl = `${scheme}://expo-development-client/?url=${metroUrl}`;

const output = execSync('adb devices', { encoding: 'utf8' });
const devices = output
  .split('\n')
  .slice(1)
  .map((line) => line.trim().split(/\s+/)[0])
  .filter((id) => id && id !== '');

if (devices.length === 0) {
  console.error('No Android devices/emulators found. Start your emulators first.');
  process.exit(1);
}

for (const device of devices) {
  console.log(`Setting adb reverse on ${device} (tcp:${port})`);
  execSync(`adb -s ${device} reverse tcp:${port} tcp:${port}`, { stdio: 'inherit' });
}

for (const device of devices) {
  console.log(`Opening Timgul dev client on ${device}`);
  try {
    execSync(
      `adb -s ${device} shell am start -a android.intent.action.VIEW -d "${devClientUrl}"`,
      { stdio: 'inherit' },
    );
  } catch {
    console.warn(`Failed to open on ${device}. Run npm run android to install the dev build first.`);
  }
}

console.log(`Done. Launched on ${devices.length} device(s).`);
