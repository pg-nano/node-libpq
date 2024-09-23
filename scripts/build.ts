import { spawnSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { promises as fs } from 'node:fs'
import { join } from 'node:path'

async function main() {
  const srcDir = join(process.cwd(), 'src')
  const hashFile = join(process.cwd(), 'build', '.srchash')

  const combinedHash = await computeCombinedHash(srcDir)
  let previousHash = ''

  try {
    previousHash = await fs.readFile(hashFile, 'utf-8')
  } catch (error) {
    // File doesn't exist, which is fine for the first run
  }

  if (previousHash !== combinedHash) {
    console.log('Source files have changed. Rebuilding...')
    spawnSync('pnpm', ['node-gyp', 'rebuild'], { stdio: 'inherit' })
    spawnSync('pnpm', ['--no-bail', 'prepare:clangd'], { stdio: 'inherit' })
    await fs.writeFile(hashFile, combinedHash)
  } else {
    console.log('No changes detected in source files. Skipping rebuild.')
  }
}

async function computeCombinedHash(directory: string): Promise<string> {
  const files = await fs.readdir(directory)
  const sourceFiles = files
    .filter(file => file.endsWith('.cc') || file.endsWith('.h'))
    .sort()

  const fileHashes = await Promise.all(
    sourceFiles.map(async file => {
      const content = await fs.readFile(join(directory, file))
      return computeHash(content)
    }),
  )

  return computeHash(Buffer.from(fileHashes.join('')))
}

async function computeHash(data: Buffer): Promise<string> {
  return createHash('sha256').update(data).digest('hex')
}

main()
