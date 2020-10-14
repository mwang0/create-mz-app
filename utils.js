const spawn = require("child_process").spawn;
const chalk = require("chalk");

exports.trace = (msg = "") => {
  console.log(msg);
};
exports.traceDone = (msg) => {
  console.log("🎉  " + chalk.green(msg));
};
exports.traceWarn = (msg) => {
  console.log("⚠️  ", chalk.yellow(msg));
};
exports.traceError = (msg) => {
  console.log("❌  ", chalk.red(msg));
  if (msg instanceof Error) {
    console.error(msg.stack);
  }
};

exports.hasYarn = async function hasYarn() {
  let res = true;
  try {
    await exports.run("yarn", ["-v"]);
  } catch (err) {
    res = false;
  }
  return res;
};

/**
 * 运行指定命令
 * @date 2019-07-24
 * @param {string} cmd
 * @param {array<string>} args
 * @param {object} options
 * @returns {promise}
 */
exports.runCmd = function runCmd(cmd, args, options) {
  return new Promise((resolve, reject) => {
    const s = spawn(
      cmd,
      args,
      Object.assign(
        {
          cwd: process.cwd(),
          stdio: "inherit",
          shell: true
        },
        options
      )
    );

    s.on("exit", () => {
      resolve();
    });
  });
};

/**
 * 依赖安装
 * @date 2019-07-23
 * @param {String} cwd
 * @returns {Promise}
 */
exports.installDependencies = async function installDependencies(cwd) {
  const { trace, runCmd, hasYarn } = exports;
  let executable = "npm";
  let args = ["install"];
  const yarn = await hasYarn();
  if (yarn) {
    executable = "yarn";
    args = [];
  }
  trace(`\n⭐️  install dependencies.`);
  return runCmd(executable, args, { cwd });
};
