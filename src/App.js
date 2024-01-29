import logo from './logo.svg';
import './App.css';
import { Octokit } from '@octokit/core'
import axios from "axios";
import { useEffect, useState } from 'react';

function App() {
  const [code, setcode] = useState();
  let _repoName = '';
  const githubAccessToken = ''
  const octokit = new Octokit({ auth: githubAccessToken });
  document.addEventListener('DOMContentLoaded', function () {
    const editor = document.getElementById('editor');
    const viewer = document.getElementById('viewer');

    editor.addEventListener('input', function () {
      const htmlCode = editor.value;
      viewer.srcdoc = htmlCode;
    });
  });

  useEffect(() => {
    const qs = window.location.search;
    const urlParam = new URLSearchParams(qs);
    const c = urlParam.get("code");
    console.log(c);

    setcode(c);
    if (c != null) {
      axios.post("https://github.com/login/oauth/access_token", {
        client_id: "903b8de041df84610191",
        client_secret: "",
        code: c
      })
        .then((response) => {
          console.log(response);
        });
    }
  }, []);

  const createGitHubRepo = async (repoName, repoDescription) => {
    try {
      _repoName = repoName
      let result = await octokit.request('POST /user/repos', {
        name: repoName,
        description: repoDescription,
        homepage: 'https://github.com',
        'private': false,
        is_template: true,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      });
      console.log(result);
    } catch (error) {
      console.error('Error creating repository:', error.message);
    }
  }

  const pushFilestoRepo = async () => {
    let result = await octokit.request('PUT /repos/JiginJayaprakash/testingStuff/contents/text.html', {
      owner: 'JiginJayaprakash',
      repo: 'testingStuff',
      path: 'index.html',
      message: 'my commit message',
      content: 'bXkgbmV3IGZpbGUgY29udGVudHM=',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });
    console.log(result);
  }

  const createGithubPage = async () => {
    await octokit.request('POST /repos/JiginJayaprakash/testingStuff/pages', {
      owner: 'JiginJayaprakash',
      repo: 'testingStuff',
      source: {
        branch: 'main',
        path: '/root'
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }
  const triggerGithubBuild = async () => {
    let result = await octokit.request('POST /repos/JiginJayaprakash/testingStuff/pages/builds', {
      owner: 'JiginJayaprakash',
      repo: 'testingStuff',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  const getLatestBuild = async () => {
    const result = await octokit.request('GET /repos/{owner}/{repo}/pages/builds/latest', {
      owner: 'OWNER',
      repo: 'REPO',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })

    return result;
  }

  const test = async () => {
    await createGitHubRepo('testingStuff', 'test successful');
    await pushFilestoRepo();
    await createGithubPage();
  }

  const login = async () => {
    window.location.href = "https://github.com/login/oauth/authorize?client_id=903b8de041df84610191"
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={login}>login</button>
        <button onClick={test}>Take the shot!</button>
        <div id="editor-container">
          <textarea id="editor" placeholder="Enter HTML code..."></textarea>
        </div>

        <div id="viewer-container">
          <iframe id="viewer"></iframe>
        </div>
      </header>
    </div>
  );
}

export default App;
