import fs from 'fs-extra';
import minimist from 'minimist';
import path from 'path';
import { fileURLToPath } from 'url';

const argv = minimist(process.argv.slice(2));
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function init() {
  let targetDiv = argv._[0] ?? '.';
  const cwd = process.cwd();
  const root = path.join(cwd, targetDiv);

  await fs.ensureDir(root);
  const existing = await fs.readdir(root);
  if (existing.length) {
    console.error(`Error: target dir is not empty`);
    process.exit(1);
  }

  const write = async (file: string, content?: string) => {
    const targetPath = path.join(root, file);
    if (content) {
      await fs.writeFile(targetPath, content);
    } else {
      await fs.copy(path.join(templateDir, file), targetPath);
    }
  }

  const templateDir = path.join(__dirname, '../template-react-ts');
  console.log(templateDir);
  const files = await fs.readdir(templateDir);
  for (const file of files.filter((name: string) => name !== 'package.json')) {
    write(file);
  }

  const pkg = fs.readJSONSync(path.join(templateDir, 'package.json'));
  pkg.name = path.basename(root);
  await write('package.json', JSON.stringify(pkg, null, 2));

  console.log('\nDone. Now run: ');
  if (root !== cwd) {
    console.log(` cd ${path.relative(cwd, root)}`);
  }
  console.log(` npm install or (pnpm install)`);
  console.log(` npm run dev`);
}

init().catch(e => {
  console.error(e);
})