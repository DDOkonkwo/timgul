import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = process.argv[2] ?? '8083';
const scheme = 'timgul';
const metroUrl = encodeURIComponent(`http://localhost:${port}`);
const devClientUrl = `${scheme}://expo-development-client/?url=${metroUrl}`;

const apkPath = path.join(
  __dirname,
  '..',
  'android',
  'app',
  'build',
  'outputs',
  'apk',
  'debug',
  'app-debug.apk',
);

const output = execSync('adb devices', { encoding: 'utf8' });
const devices = output
  .split('\n')
  .slice(1)
  .map((line) => line.trim().split(/\s+/)[0])
  .filter((id) => id && id !== '');

if (devices.length === 0) {
  console.error('No Android devices/emulators found.');
  process.exit(1);
}

if (existsSync(apkPath)) {
  for (const device of devices) {
    console.log(`Installing APK on ${device}...`);
    execSync(`adb -s ${device} install -r "${apkPath}"`, { stdio: 'inherit' });
  }
} else {
  console.warn(`APK not found at ${apkPath}. Run npm run android first to build.`);
}

for (const device of devices) {
  execSync(`adb -s ${device} reverse tcp:${port} tcp:${port}`, { stdio: 'inherit' });
}

for (const device of devices) {
  console.log(`Launching dev client on ${device}`);
  try {
    execSync(
      `adb -s ${device} shell am start -a android.intent.action.VIEW -d "${devClientUrl}"`,
      { stdio: 'inherit' },
    );
  } catch {
    console.warn(`Failed to launch on ${device}`);
  }
}

console.log(`Done for ${devices.length} device(s).`);
