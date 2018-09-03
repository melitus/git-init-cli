import  _ from 'lodash';
import fs from 'fs';
import git from 'simple-git';
import CLI from 'clui'

import inquirer from './inquirer';
import gh  from './github';

const Spinner     = CLI.Spinner;

  export const createRemoteRepo = async () => {
    const github = gh.getInstance();
    const answers = await inquirer.askRepoDetails();

    const data = {
      name : answers.name,
      description : answers.description,
      private : (answers.visibility === 'private')
    };

    const status = new Spinner('Creating remote repository...');
    status.start();

    try {
      const response = await github.repos.create(data);
      return response.data.ssh_url;
    } catch(err) {
      throw err;
    } finally {
      status.stop();
    }
  };

  export const createGitignore = async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore');

    if (filelist.length) {
      const answers = await inquirer.askIgnoreFiles(filelist);
      if (answers.ignore.length) {
        fs.writeFileSync( '.gitignore', answers.ignore.join( '\n' ) );
      } else {
        touch( '.gitignore' );
      }
    } else {
        touch('.gitignore');
    }
  };

  export const setupRepo = async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();

    try {
      await git
        .init()
        .add('.gitignore')
        .add('./*')
        .commit('Initial commit')
        .addRemote('origin', url)
        .push('origin', 'master');
      return true;
    } catch(err) {
      throw err;
    } finally {
      status.stop();
    }
  };
