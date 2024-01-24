import logo from './logo.svg';
import './App.css';
import { Octokit } from '@octokit/core'

function App() {
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

  const createGithubPage = async() => {
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
  const triggerGithubBuild = async() => {
   let result = await octokit.request('POST /repos/JiginJayaprakash/testingStuff/pages/builds', {
      owner: 'JiginJayaprakash',
      repo: 'testingStuff',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    })
  }

  const getLatestBuild = async() => {
   const result =  await octokit.request('GET /repos/{owner}/{repo}/pages/builds/latest', {
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
  return (
    <div className="App">
      <header className="App-header">
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
