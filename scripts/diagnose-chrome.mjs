import { execSync } from 'child_process';

try {
  const output = execSync('wmic process where "name=\'chrome.exe\'" get ProcessId,CommandLine /format:list', { encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 });
  console.log(output);
} catch (e) {
  console.error(e);
}
