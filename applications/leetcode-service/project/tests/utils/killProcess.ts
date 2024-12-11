import { exec } from 'child_process';

function killProcess(
  pid: number,
  callback: (error: Error | null) => void,
): void {
  const command =
    process.platform === 'win32' ? `taskkill /PID ${pid} /F` : `kill -9 ${pid}`;

  exec(command, (error) => {
    if (error) {
      callback(error);
      return;
    }

    console.log(`Process ${pid} has been killed.`);
    callback(null);
  });
}

export { killProcess };
