import React from 'react'
import Upload from './Upload'

class MultUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numUpload: 1
    }; 
  }

  upload = (e) => {
    e.preventDefault();
    e.persist();
    // console.log(e.target.files);
    console.log(e);
    
    const formData  = new FormData();
    // formData.append("data", e.target.files[0]);
    console.log(this.state.file)
    formData.append("data", this.state.file);
    
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
      // "https://upload.estuary.tech/content/add"
    );
    xhr.setRequestHeader(
      "Authorization", 
      "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
      // "Bearer " + process.env.REACT_APP_LIVE_ESTUARY
    );
    xhr.send(formData);
  }

  addFileEvent = (e) => {
    console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] }, () => {
      console.log(this.state)
    })
  }

  addNameEvent = (e) => {
    console.log(e.target.value)
    this.setState({ name: e.target.value }, () => {
      console.log(this.state)
    })
  }

  onAddUpload = () => {
    this.setState({ 
      numUpload: this.state.numUpload + 1 
    }, () => {
      console.log(this.state)
    })
  }

  render() {
    const uploadChildren = [];

    for (var i = 0; i < this.state.numUpload; i += 1) {
      uploadChildren.push(<Upload key={i} number={i} />);
    };

    return (
      <React.Fragment>
        <form onSubmit={this.upload}>
          {uploadChildren}
          <p><a href="#" onClick={this.onAddUpload}>Add File</a></p>
          <input type="submit" value="Confirm" />
        </form>
      </React.Fragment>
    );
  }
}

export default MultUpload
