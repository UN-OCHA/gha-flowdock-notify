import { readdir, readFile } from 'node:fs/promises';

if (process.argv.length < 3 || process.argv.length > 3) {
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} directory`);
  process.exit(1);
}

var fileList = [];
var output = Array(0);

const regex = `@see (?<link>(?:(?:[a-z]+:)?//)(?:www\\.drupal\\.org)(?:(?:[/?#][^\\s"]*[^\\s".?!])|[/])?)`;

const dir = process.argv[2];

try {
  fileList = await readdir(dir, { recursive: true, withFileTypes: true });
} catch (err) {
  console.error(err);
}

// Read each file in files and look for lines matching regex.
for (const dirent of fileList) {
  // Are you a file?
  if (dirent.isFile()) {
    let filePath = dirent.parentPath + '/' + dirent.name;
    let contents;

    try {
      contents = await readFile(filePath, { encoding: 'utf8' });
    } catch (err) {
      console.error(err.message);
    }

    var urls = new Array(0);
    for (const line of contents.split(/\n/)) {
      const matches = line.match(regex);
      if (matches != null) {
        urls.push(matches.groups.link);
      }
    }
    if (urls.length) {
      output.push({ file: dirent.name, path: filePath, issues: urls});
    }
  }
}

console.log(output);
