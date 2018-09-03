import octokit from '@octokit/rest';
import Configstore from 'configstore';
import pkg from '../package.json';
import _ from 'lodash';
import CLI from 'clui';
import chalk from 'chalk';

import inquirer from './inquirer';

const Spinner = CLI.Spinner;

const conf = new Configstore(pkg.name);

export const getInstance = () => {
    return octokit;
  };

  export const setGithubCredentials = async () => {
    const credentials = await inquirer.askGithubCredentials();
    octokit.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    );
  };

  export const registerNewToken = async () => {
    const status = new Spinner('Authenticating you, please wait...');
    status.start();

    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'git-init-repo, the command-line tool for initalizing Git repos'
      });
      const token = response.data.token;
      if(token) {
        conf.set('github.token', token);
        return token;
      } else {
        throw new Error("Missing Token","Github token was not found in the response");
      }
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  },

 export const githubAuth = (token) => {
    octokit.authenticate({
      type : 'oauth',
      token : token
    });
  };

 export const getStoredGithubToken = () => {
    return conf.get('github.token');
  };

 export const hasAccessToken = async () => {
    const status = new Spinner('Authenticating you, please wait...');
    status.start();

    try {
      const response = await octokit.authorization.getAll();
      const accessToken = _.find(response.data, (row) => {
        if(row.note) {
          return row.note.indexOf('ginit') !== -1;
        }
      });
      return accessToken;
    } catch (err) {
      throw err;m
    } finally {
      status.stop();
    }
  };

export const regenerateNewToken = async (id) => {
    const tokenUrl = 'https://github.com/settings/tokens/' + id;
    console.log('Please visit ' + chalk.underline.blue.bold(tokenUrl) + ' and click the ' + chalk.red.bold('Regenerate Token Button.\n'));
    const input = await inquirer.askRegeneratedToken();
    if(input) {
      conf.set('github.token', input.token);
      return input.token;
    }
  };

