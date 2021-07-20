import globby from 'globby';
import * as path from 'path';

import * as fs from 'fs-extra';
import slash from 'slash';

export async function globFind(
  baseDir: string,
  glob: string
): Promise<Array<{relative: string; absolute: string}>> {
  const pageFiles: string[] = await globby(glob, {
    cwd: baseDir,
    ignore: ['**/node_modules/**/*'],
    onlyFiles: true
  });
  console.log(pageFiles);

  return pageFiles.map((relative) => {
    const absolute = path.join(baseDir, relative);
    return {relative, absolute};
  });
}

export async function resolveFile(
  pagesDirPath: string,
  name: string,
  extensions: string[]
) {
  for (let filename of extensions.map((ext) => name + ext)) {
    filename = path.join(pagesDirPath, filename);
    if (await fs.pathExists(filename)) {
      return slash(filename);
    }
  }

  throw new Error("can't find theme inside pagesDir: " + pagesDirPath);
}
