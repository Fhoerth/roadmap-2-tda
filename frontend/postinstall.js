// Download file manually

// import { execSync } from 'child_process';

// const packages = [
//   { name: '@esbuild/darwin-x64', platform: 'darwin', cpu: 'x64' },
//   { name: '@esbuild/darwin-arm64', platform: 'darwin', cpu: 'arm64' },
//   { name: '@esbuild/linux-x64', platform: 'linux', cpu: 'x64' },
//   { name: '@esbuild/linux-arm64', platform: 'linux', cpu: 'arm64' },
//   { name: '@esbuild/windows-x64', platform: 'win32', cpu: 'x64' },
//   { name: '@esbuild/windows-arm64', platform: 'win32', cpu: 'arm64' },
// ];

// const failedPackages = [];
// const successPackages = [];

// execSync(`rm -rf ${process.cwd()}/node_modules/@esbuild`, { stdio: 'inherit' });
// execSync(`mkdir -p ${process.cwd()}/node_modules/@esbuild`, {
//   stdio: 'inherit',
// });

// for (const pkg of packages) {
//   const command = `npm install --no-save ${pkg.name} --platform=${pkg.platform} --cpu=${pkg.cpu}`;
//   try {
//     console.log(
//       `Installing ${pkg.name} for platform: ${pkg.platform}, CPU: ${pkg.cpu}...`,
//     );
//     execSync(command, { stdio: 'inherit' });
//     console.log(`Successfully installed ${pkg.name}`);
//     successPackages.push(pkg.name);
//   } catch (error) {
//     console.warn(`Failed to install ${pkg.name}. Continuing...`);
//     failedPackages.push(pkg.name);
//   }
// }

// if (successPackages.length > 0) {
//   console.log('The following packages are now installed:');
//   console.log(successPackages.join('\n'));
//   console.log('\n');
//   execSync(`ls -la ${process.cwd()}/node_modules/@esbuild`, {
//     stdio: 'inherit',
//   });
// }
