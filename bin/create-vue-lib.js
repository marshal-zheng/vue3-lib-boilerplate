#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');
const minimist = require('minimist');
const { execSync } = require('child_process');

const args = minimist(process.argv.slice(2));
const targetPath = args.path || process.cwd();
const interactiveMode = args.interactive;
const configFilePath = path.join(require('os').homedir(), '.vgenconfig.json');

const defaultOptions = {
  org: '',
  name: 'vue-demo',
  component: ''
};

async function promptUser() {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'org',
      message: 'Enter the npm organization (optional):',
    },
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of your new component library:',
      default: 'vue-demo',
      validate: input => (input ? true : 'Name cannot be empty'),
    },
    {
      type: 'input',
      name: 'component',
      message: 'Enter the name of your component (optional):',
    },
  ]);
  return answers;
}

async function createVueLib() {
  let options;
  if (interactiveMode) {
    options = await promptUser();
  } else {
    options = {
      org: args.org || defaultOptions.org,
      name: args.name || defaultOptions.name,
      component: args.component || defaultOptions.component
    };
  }

  if (!args['no-org'] && !options.org && fs.existsSync(configFilePath)) {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    options.org = config.defaultOrg || '';
  }

  if (args['no-org']) {
    options.org = '';
  }

  const { org, name, component } = options;
  const targetDir = path.join(targetPath, name);

  if (fs.existsSync(targetDir)) {
    console.log(chalk.red(`Directory ${name} already exists.`));
    process.exit(1);
  }

  try {
    await fs.copy(path.join(__dirname, '../template'), targetDir);

    const gitignoreContent = `
    .idea
    *.iml
    *.tgz
    node_modules/

    # OS
    .DS_Store
    .idea
    .editorconfig
    .npmrc
    package-lock.json

    pnpm-lock.yaml
    yarn.lock
    `;

    const cleanedContent = gitignoreContent
      .split('\n')
      .map(line => line.trim())
      .join('\n');

    fs.writeFileSync(path.join(targetDir, '.gitignore'), cleanedContent);

    const packageJsonPath = path.join(targetDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.name = org ? `@${org}/${name}` : name;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log(
      chalk.green(`Component library ${name} created successfully at ${targetDir}.`)
    );

    const replaceInFile = (filePath, searchValue, replaceValue) => {
      if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = content.replace(new RegExp(searchValue, 'g'), replaceValue);
        fs.writeFileSync(filePath, content, 'utf8');
      }
    };

    const replaceInDirectory = (dirPath, searchValue, replaceValue) => {
      fs.readdirSync(dirPath).forEach(file => {
        const fullPath = path.join(dirPath, file);
        if (fs.lstatSync(fullPath).isDirectory()) {
          replaceInDirectory(fullPath, searchValue, replaceValue);
        } else {
          replaceInFile(fullPath, searchValue, replaceValue);
        }
      });
    };

    replaceInDirectory(targetDir, 'vue-demo', name);

    if (org) {
      const typingsPath = path.join(targetDir, 'typings', 'index.d.ts');
      replaceInFile(
        typingsPath,
        "declare module 'vue-demo'",
        `declare module '${packageJson.name}'`
      );
    }

    if (component) {
      const replaceComponentInDirectory = dirPath => {
        fs.readdirSync(dirPath).forEach(file => {
          const fullPath = path.join(dirPath, file);
          if (fs.lstatSync(fullPath).isDirectory()) {
            replaceComponentInDirectory(fullPath);
          } else {
            if (
              ['example.js', 'cjs.ts', 'index.d.ts', 'Demo.tsx'].includes(file)
            ) {
              replaceInFile(fullPath, 'Demo', component);
              replaceInFile(fullPath, 'demo', component.toLowerCase());
              if (file === 'Demo.tsx') {
                const newFilePath = path.join(
                  path.dirname(fullPath),
                  `${component}.tsx`
                );
                fs.renameSync(fullPath, newFilePath);
              }
            }
          }
        });
      };

      replaceComponentInDirectory(targetDir);
    }

    const scriptFilePath = path.join(targetDir, 'script.js');
    if (fs.existsSync(scriptFilePath)) {
      let content = fs.readFileSync(scriptFilePath, 'utf8');
      content = content.replace(/vue-demo/g, name);
      fs.writeFileSync(scriptFilePath, content, 'utf8');
    }

    process.chdir(targetDir);
    console.log(chalk.blue('Running yarn install...'));
    execSync('yarn install', { stdio: 'inherit' });
    console.log(chalk.green('Dependencies installed successfully.'));

    execSync('git init', { stdio: 'inherit' });
    console.log(chalk.green('Git repository initialized.'));

    execSync('npx husky install', { stdio: 'inherit' });
    console.log(chalk.green('Husky initialized successfully.'));

    const huskyDir = path.join(targetDir, '.husky');
    if (fs.existsSync(huskyDir)) {
      const huskyFiles = fs.readdirSync(huskyDir);
      huskyFiles.forEach(file => {
        const filePath = path.join(huskyDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.chmodSync(filePath, '755');
        }
      });
    }

  } catch (err) {
    console.error(chalk.red(`Error creating component library: ${err.message}`));
  }
}

function setDefaultOrg(org) {
  const config = fs.existsSync(configFilePath) ? JSON.parse(fs.readFileSync(configFilePath, 'utf8')) : {};
  config.defaultOrg = org;
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  console.log(chalk.green(`Default organization set to ${org}`));
}

const command = args._[0];

if (command === 'set-org' && args._[1]) {
  setDefaultOrg(args._[1]);
} else {
  createVueLib();
}