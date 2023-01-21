import React from 'react'
import Upload from './Upload'

class MultUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numUpload: 1,
      files: {0: {
        loaded: 0,
        total: 0
      }}
    }; 
  }

  uploadChildCallback = (fileObj) => {
    this.setState(prevState => { 
      let files = { ...prevState.files }
      files[fileObj["num"]] = {
        ...prevState.files[fileObj["num"]],
        name: fileObj["name"],
        file: fileObj["file"]
      }
      return { files }; 
    }, () => {
      console.log(this.state)
    })
  }

  setFileProgress = (progressObj) => {
    this.setState(prevState => {
      let files = { ...prevState.files }
      files[progressObj.num] = {
        ...prevState.files[progressObj.num],
        loaded: progressObj.loaded,
        total: progressObj.total
      }
      return { files };
  }, () => {
      console.log(this.state)
    })
  }

  upload = (fileKey) => { 
    return new Promise((resolve) => { 
      const formData  = new FormData();
      // formData.append("data", e.target.files[0]);
      const file = this.state.files[fileKey]["file"]
      console.log(file)
      formData.append("data", file);
      
      const xhr = new XMLHttpRequest();
      
      xhr.upload.onprogress = (event) => {
        // this.setState({
          // loaded: event.loaded,
          // total: event.total
        // });
        this.setFileProgress({
          num: fileKey,
          loaded: event.loaded,
          total: event.total
        })
      }
      
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const cid = JSON.parse(xhr.responseText).cid
          console.log(cid);
          this.setState(prevState => {
            let files = { ...prevState.files }
            files[fileKey] = {
              ...prevState.files[fileKey],
              cid: cid
            }
            return { files };
          }, () => {
            // console.log(this.state)
            console.log(this.state.files, fileKey);
            resolve({
              name: this.state.files[fileKey].name,
              cid: this.state.files[fileKey].cid
            })
          })
        }
      }.bind(this)
      xhr.open(
        "POST", 
        // "http://localhost:3004/content/add"
        // "https://upload.estuary.tech/content/add"
        "https://api.estuary.tech/content/add"
      );
      xhr.setRequestHeader(
        "Authorization", 
        // "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
        "Bearer " + process.env.REACT_APP_LIVE_ESTUARY
      );
      xhr.send(formData);
    })
  }

  uploadAll = () => {
    let uploadPromises = []
    for (const fileKey in this.state.files){
      uploadPromises.push(this.upload(fileKey))
    }
    return Promise.all(uploadPromises)
  }

  mint = (e) => { 
    e.preventDefault();
    e.persist();
    this.uploadAll().then(uploadResults => {
      console.log(uploadResults)
    })
  }

  onAddUpload = () => {
    this.setState({ 
      numUpload: this.state.numUpload + 1 
    })
    this.setState(prevState => {
      let files = { ...prevState.files }
      files[Object.keys(files).length] = {
        loaded: 0,
        total: 0
      }
      return { files };
    }, () => {
      console.log(this.state)
    })
  }

  render() {
    const uploadChildren = [];

    for (var i = 0; i < this.state.numUpload; i += 1) {
      uploadChildren.push(<Upload key={i} num={i}
        uploadChildCallback={this.uploadChildCallback}
        loaded={this.state.files[i].loaded}
        total={this.state.files[i].total} />);
    };

    return (
      <React.Fragment>
        <form onSubmit={this.mint}>
          {uploadChildren}
          <p><a href="#" onClick={this.onAddUpload}>Add File</a></p>
          <input type="submit" value="Confirm" />
        </form>
      </React.Fragment>
    );
  }
}

export default MultUpload
