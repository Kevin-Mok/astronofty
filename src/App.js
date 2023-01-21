import logo from './logo.svg';
import './App.css';

import React from 'react'

class App extends React.Component {
  upload(e) {
    e.persist();
    console.log(e.target.files);
    
    const formData  = new FormData();
    formData.append("data", e.target.files[0]);
    
    // NOTE
    // This example uses XMLHttpRequest() instead of fetch
    // because we want to show progress. But you can use
    // fetch in this example if you like.
    const xhr = new XMLHttpRequest();
    
    xhr.upload.onprogress = (event) => {
      this.setState({ 
        loaded: event.loaded, 
        total: event.total 
      });
    }
    
    xhr.open(
      "POST", 
      "http://localhost:3004/content/add"
    );
    xhr.setRequestHeader(
      "Authorization", 
      "Bearer EST0199f6c2-e72a-4442-8c41-03ea93deac11ARY"
    );
    xhr.send(formData);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <React.Fragment>
            <input type="file" onChange={this.upload.bind(this)} />
            <br />
            <pre>{JSON.stringify(this.state, null, 1)}</pre>
          </React.Fragment>
        </header>
      </div>
    );
  }
}

/* function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
} */

export default App;
