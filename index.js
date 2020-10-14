#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const argv = require("minimist")(process.argv.slice(2));
const { installDependencies, traceDone, traceError } = require("./utils");

async function init() {
  const targetDir = argv._[0] || ".";
  const cwd = process.cwd();
  const root = path.join(cwd, targetDir);
  const renameFiles = {
    _gitignore: ".gitignore",
    "_eslintrc.json": ".eslintrc.json",
    "_eslintrc.json": ".eslintrc.json"
  };
  await fs.ensureDir(root);
  let existing = await fs.readdir(root);
  if (existing.length) {
    traceError("Error target directory is not empty.");
    process.exit(1);
  }
  const templateName = `template-${argv.t || argv.template || "admin"}`;
  const templateDir = path.join(__dirname, templateName);

  existing = await fs.readdir(templateDir);
  if (!existing.length) {
    traceError(`Error ${templateDir} directory is empty.`);
    process.exit(1);
  }

  const write = async (file, content) => {
    const targetPath = renameFiles[file]
      ? path.join(root, renameFiles[file])
      : path.join(root, file);

    if (content) {
      await fs.writeFile(targetPath, content);
    } else {
      await fs.copy(path.join(templateDir, file), targetPath);
    }
  };

  const files = await fs.readdir(templateDir);
  for (const file of files.filter((f) => f !== "package.json")) {
    await write(file);
  }

  const existsPkg = await fs.pathExists(path.join(templateDir, "package.json"));
  if (existsPkg) {
    const pkg = require(path.join(templateDir, `package.json`));
    pkg.name = path.basename(root);
    await write("package.json", JSON.stringify(pkg, null, 2));
    await installDependencies(targetDir);
  }
  traceDone(`\nDone.`);
}

init().catch((e) => {
  traceError(e);
});
