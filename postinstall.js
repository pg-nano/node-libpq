import { spawnSync } from 'node:child_process'
import fs from 'node:fs'

if (!fs.existsSync('.git')) {
  spawnSync('node-gyp', ['rebuild'], { stdio: 'inherit' })
}
