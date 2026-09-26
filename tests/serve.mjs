import { cp, mkdtemp, mkdir, symlink, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawn } from 'node:child_process'

const project = await mkdtemp(join(tmpdir(), 'idsk-regression-'))
for (const file of ['src', 'public', 'package.json', 'tsconfig.json', 'postcss.config.mjs', 'next.config.ts']) {
  await cp(resolve(file), join(project, file), { recursive: true })
}
await symlink(resolve('node_modules'), join(project, 'node_modules'), 'dir')
await mkdir(join(project, 'src/app/probe'), { recursive: true })
await cp(resolve('tests/fixture.tsx'), join(project, 'src/app/probe/page.tsx'))
const server = spawn(process.execPath, [resolve('node_modules/next/dist/bin/next'), 'dev', '--webpack', '--port', '3168'], {
  cwd: project, stdio: 'inherit', env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
})
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.kill(signal))
server.on('exit', async (code) => {
  await rm(project, { recursive: true, force: true })
  process.exit(code ?? 0)
})
