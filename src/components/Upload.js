import React from "react";

// <input type="submit" value="Confirm" />
// <pre>{JSON.stringify(this.state, null, 1)}</pre>
class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      name: "",
    };
    if (props.name) {
      this.state.name = props.name;
    }
  }

  uploadChildCallback = () => {
    this.props.uploadChildCallback({
      num: this.props.num,
      file: this.state.file,
      name: this.state.name,
    });
  };

  addFileEvent = (e) => {
    // console.log(e.target.files[0])
    this.setState({ file: e.target.files[0] }, () => {
      console.log(this.state);
      this.uploadChildCallback();
    });
  };

  addNameEvent = (e) => {
    console.log(e.target.value);
    this.setState({ name: e.target.value }, () => {
      console.log(this.state);
      this.uploadChildCallback();
    });
  };

  render() {
    return (
      <React.Fragment>
        <input
          name="fileName"
          className="shadow appearance-none
                  border rounded w-full py-2 px-3
                  text-gray-700 leading-tight
                  focus:outline-none focus:shadow-outline"
          placeholder="Image description"
          onChange={this.addNameEvent}
          value={this.state.name}
        />
        <input
          type="file"
          onChange={this.addFileEvent}
          className="inline my-4 text-white"
        />
        <Progress loaded={this.props.loaded} total={this.props.total} />
        <br />
      </React.Fragment>
    );
  }
}

const Progress = ({ loaded, total }) => {
  // <pre>{this.props.loaded}/{this.props.total}</pre>
  return (
    <span
      className={
        total == 0
          ? // "inline text-white" :
            "hidden text-white"
          : "inline text-white"
      }
    >
      {(loaded / total) * 100}%
    </span>
  );
};

export default Upload;

// <pre className={(total == 0) ?
// <pre className={totalZero ?
// 'hide-progress' : 'show-progress'}>
// {this.props.loaded}/{this.props.total}</pre>
