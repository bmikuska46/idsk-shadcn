import { createServer } from 'node:http'
import { mkdtemp, mkdir, readFile, writeFile, readdir, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { spawnSync } from 'node:child_process'

const directory = await mkdtemp(join(tmpdir(), 'idsk-consumer-'))
const registry = JSON.parse(await readFile('registry.json', 'utf8'))
const items = new Map()
let server
function run(command, args, cwd = directory) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' })
  if (result.status !== 0) throw new Error(`${command} exited with ${result.status}`)
}
try {
  // The CLI needs the server while installing; run it asynchronously below.
  server = createServer((request, response) => {
    const item = items.get(request.url)
    response.writeHead(item ? 200 : 404, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify(item ?? { error: 'Not found' }))
  })
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  const base = `http://127.0.0.1:${server.address().port}`
  for (const item of registry.items) {
    items.set(`/${item.name}.json`, {
      $schema: 'https://ui.shadcn.com/schema/registry-item.json', ...item,
      registryDependencies: item.registryDependencies?.map((dependency) => dependency.startsWith('bmikuska46/idsk-shadcn/') ? `${base}/${dependency.split('/').at(-1)}.json` : dependency),
      files: await Promise.all(item.files.map(async (file) => ({ ...file, content: await readFile(resolve(file.path), 'utf8') }))),
    })
  }
  await mkdir(join(directory, 'src'), { recursive: true })
  await writeFile(join(directory, 'package.json'), JSON.stringify({ name: 'idsk-consumer-check', private: true, dependencies: { react: '^19.3.0', 'react-dom': '^19.3.0', tailwindcss: '^4.3.3' }, devDependencies: { typescript: '~6.0.2', '@types/react': '^19.3.0', '@types/react-dom': '^19.3.0' } }))
  await writeFile(join(directory, 'tsconfig.json'), JSON.stringify({ compilerOptions: { target: 'ES2020', lib: ['DOM', 'ES2020'], module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx', strict: true, skipLibCheck: true, noEmit: true, paths: { '~/*': ['./src/*'] } }, include: ['src'] }))
  await writeFile(join(directory, 'src/index.css'), '@import "tailwindcss";\n')
  await writeFile(join(directory, 'components.json'), JSON.stringify({ $schema: 'https://ui.shadcn.com/schema.json', style: 'new-york', rsc: true, tsx: true, tailwind: { css: 'src/index.css', baseColor: 'neutral', cssVariables: true }, aliases: { components: '~/components', ui: '~/ui', utils: '~/lib/utils', lib: '~/lib', hooks: '~/hooks' } }))
  run('pnpm', ['install'])
  const { spawn } = await import('node:child_process')
  await new Promise((resolve, reject) => {
    const process = spawn('pnpm', ['dlx', 'shadcn@latest', 'add', '--yes', '--overwrite', ...registry.items.map((item) => `${base}/${item.name}.json`)], { cwd: directory, stdio: 'inherit' })
    process.on('error', reject)
    process.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Registry install exited with ${code}`)))
  })
  run('pnpm', ['exec', 'tsc', '--noEmit'])
  const expected = registry.items.filter((item) => item.type === 'registry:ui').length
  const installed = (await readdir(join(directory, 'src/ui'))).filter((file) => file.endsWith('.tsx')).length
  if (installed !== expected) throw new Error(`Expected ${expected} UI modules, installed ${installed}`)
  console.log(`Installed ${registry.items.length} registry items and type-checked ${installed} UI modules with custom aliases.`)
} finally {
  server?.close()
  await rm(directory, { recursive: true, force: true })
}
