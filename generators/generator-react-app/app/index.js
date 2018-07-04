var Generator = require("yeoman-generator"),
  _ = require("lodash"),
  glob = require("glob"),
  chalk = require("chalk"),
  log = console.log,
  fs = require("fs"),
  path = require("path"),
  del = require("del"),
  generatorName = "gulp"; // 记住这个名字，下面会有用

// 导出模块，使得yo xxx能够运行
module.exports = class ReactAppGenerator extends Generator {
  constructor(args, opts) {
    // 默认会添加的构造函数
    super(args, opts);

    // this.option('babel'); // This method adds support for a `--babel` flag

    // 检查脚手架是否已经存在
    // var dirs = glob.sync("+(dist)");

    // if (_.includes(dirs, "dist")) {
    //   // 如果已经存在脚手架，则退出
    //   log(chalk.bold.green("资源已经初始化，退出..."));
    //   setTimeout(function() {
    //     process.exit(1);
    //   }, 200);
    // }

    this.argument("appname", { type: String, required: false });
    this.argument("type", { type: String, required: false, default: "empty" });
  }

  prompting() {
    if (!this.options.appname) {
      // 询问用户
      return this.prompt([
        {
          type: "input",
          name: "name",
          message: "Your project name",
          default: this.appname // Default to current folder name
        }
      ]).then(answers => {
        this.options.appname = answers.name;

        this.log("app name", answers.name);
      });
    }
  }

  writing() {
    let { appname, type } = this.options;
    let src = this.templatePath(type);
    let dest = appname;

    this.destinationRoot(dest);

    log(chalk.gray(`create directory "${appname}".`));

    if (!fs.existsSync(dest)) {
      fs.mkdirSync(appname);
    }

    log(chalk.gray("create files..."));

    //拷贝文件
    this.fs.copy(src, "");

    // 生成package.json
    this.fs.copyTpl(
      this.templatePath(`${src}/package.json`),
      this.destinationPath(`package.json`),
      {
        name: appname
      }
    );
  }

  install() {
    this.npmInstall();
  }

  end() {
    // 搭建完执行的操作
  }
};
