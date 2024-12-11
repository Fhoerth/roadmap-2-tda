import { exec } from 'child_process';

import { DeferredPromise } from '../../main/modules/DeferredPromise';

interface ProcessInfo {
  cmd: string;
  pid: number;
}

async function getProcessList(): Promise<ProcessInfo[]> {
  const command =
    process.platform === 'win32'
      ? 'wmic process get ProcessId,CommandLine'
      : 'ps aux';

  const deferredPromise = new DeferredPromise<ProcessInfo[]>();

  exec(command, (error, stdout) => {
    if (error) {
      deferredPromise.reject(error);
      return;
    }

    const processes: ProcessInfo[] = [];

    if (process.platform === 'win32') {
      const lines = stdout.split('\n').slice(1);

      for (const line of lines) {
        const match = line.match(/(.+?)\s+(\d+)$/);

        if (match) {
          const [, cmd, pid] = match;
          processes.push({ cmd, pid: parseInt(pid, 10) });
        }
      }
    } else {
      const lines = stdout.split('\n').slice(1);

      for (const line of lines) {
        const columns = line.trim().split(/\s+/);
        const pid = parseInt(columns[1], 10);
        const cmd = columns.slice(10).join(' ');

        processes.push({ cmd, pid });
      }
    }

    deferredPromise.resolve(processes);
  });

  return deferredPromise.waitForPromise();
}

async function waitForChromeToLaunch(
  callback: (pid: number | null, error?: Error) => void,
  timer: number = 50,
): Promise<() => void> {
  let listening = true;

  const knownPIDs: Set<number> = new Set();
  const initialProcesses = await getProcessList();

  const updateKnownPIDs = (processes: ProcessInfo[]) => {
    for (const process of processes) {
      knownPIDs.add(process.pid);
    }
  };

  updateKnownPIDs(initialProcesses);

  const interval = setInterval(async () => {
    if (!listening) {
      return;
    }

    const currentProcesses = await getProcessList();

    const newChromeProcess = currentProcesses.find(
      ({ cmd, pid }) =>
        (cmd.toLowerCase().includes('chrome') ||
          cmd.toLowerCase().includes('chromium')) &&
        !knownPIDs.has(pid),
    );

    if (newChromeProcess) {
      knownPIDs.add(newChromeProcess.pid);
      callback(newChromeProcess.pid);
    }
  }, timer);

  return () => {
    listening = false;
    clearInterval(interval);
  };
}

export { waitForChromeToLaunch };
