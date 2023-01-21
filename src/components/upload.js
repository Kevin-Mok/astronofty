import React from 'react'

// const upload = () => {
  // upload(e) {
    // e.persist();
    // console.log(e.target.files);

    // const formData  = new FormData();
    // formData.append("data", e.target.files[0]);

    // // NOTE
    // // This example uses XMLHttpRequest() instead of fetch
    // // because we want to show progress. But you can use
    // // fetch in this example if you like.
    // const xhr = new XMLHttpRequest();

    // xhr.upload.onprogress = (event) => {
      // this.setState({
        // loaded: event.loaded,
        // total: event.total
      // });
    // }

    // xhr.open(
      // "POST",
      // "http://localhost:3004/content/add"
    // );
    // xhr.setRequestHeader(
      // "Authorization",
      // "Bearer EST0199f6c2-e72a-4442-8c41-03ea93deac11ARY"
    // );
    // xhr.send(formData);
  // }
    // return (
        // <header className="App-header">
          // <React.Fragment>
            // <input type="file" onChange={this.upload.bind(this)} />
            // <br />
            // <pre>{JSON.stringify(this.state, null, 1)}</pre>
          // </React.Fragment>
        // </header>
    // )
// }

class Upload extends React.Component {
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
    
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        console.log(JSON.parse(xhr.responseText).cid);
      }
    }
    xhr.open(
      "POST", 
      "http://localhost:3004/content/add"
    );
    xhr.setRequestHeader(
      "Authorization", 
      "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
    );
    xhr.send(formData);
  }

  render() {
    return (
      <React.Fragment>
        <input type="file" onChange={this.upload.bind(this)} />
        <br />
        <pre>{JSON.stringify(this.state, null, 1)}</pre>
      </React.Fragment>
    );
  }
}

export default Upload

