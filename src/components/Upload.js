import React from 'react'

import './Upload.css';

          // <input type="submit" value="Confirm" />
        // <pre>{JSON.stringify(this.state, null, 1)}</pre>
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      name: ""
    }; 
  }

  uploadChildCallback = () => {
    this.props.uploadChildCallback({
      num: this.props.num,
      file: this.state.file,
      name: this.state.name,
    })
  }

  addFileEvent = (e) => {
    // console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] }, () => {
      console.log(this.state)
      this.uploadChildCallback()
    })
  }

  addNameEvent = (e) => {
    console.log(e.target.value)
    this.setState({ name: e.target.value }, () => {
      console.log(this.state)
      this.uploadChildCallback()
    })
  }

  render() {
    return (
      <React.Fragment>
        <input type="file" onChange={this.addFileEvent}/>
        <br />
        <input name="fileName" onChange={this.addNameEvent} />
        <br />
        <Progress loaded={this.props.loaded}
          total={this.props.total} />
      </React.Fragment>
    );
  }
}

const Progress = ({ loaded, total }) => {
        // <pre>{this.props.loaded}/{this.props.total}</pre>
  const totalZero = total == 0
  return (
    <div className={totalZero ? 'hide-progress' : 'show-progress'}>
      {(loaded/total)*100}%
    </div>
  );
};

export default Upload

    // <pre className={(total == 0) ?
    // <pre className={totalZero ?
      // 'hide-progress' : 'show-progress'}>
    // {this.props.loaded}/{this.props.total}</pre>
