import logo from './logo.svg';
import './App.css';
import { Octokit } from '@octokit/core'

function App() {
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
      await octokit.request('POST /user/repos', {
        name: repoName,
        description: repoDescription,
        homepage: 'https://github.com',
        'private': false,
        is_template: true,
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })
    } catch (error) {
      console.error('Error creating repository:', error.message);
    }
  }



  const test = async () => {
    await createGitHubRepo('testingStuff', 'test successful');
    const articleFiles = [
      {
          path: "/index.html",
          content: "Hello World!",
          encoding: "utf-8",
      },
      {
          path: "/images/logo.png",
          content: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQ",
          encoding: "base64",
      },
  ];
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
