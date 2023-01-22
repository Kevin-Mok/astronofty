import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import React from "react";

import Upload from "./Upload";

const ethers = require("ethers");

// export default function SellNFT () {
class UpdateImages extends React.Component {
  constructor(props) {
    // TODO: get existing NFT metadata from NFT
    // page //
    super(props);
    this.state = {
      name: props.data.name,
      description: props.data.description,
      price: "",
      fileURL: null,
      msg: "",
      recipient: "",
      numUpload: 1,
      files: {
        // 0: {
        // loaded: 0,
        // total: 0,
        // },
      },
    };
    for (let i = 0; i < props.data.images.length; i++) {
      console.log(props.data.images[i]);
      // let files = { ...prevState.files };
      this.state.files[i] = {
        name: props.data.images[i].trait_type,
        cid: props.data.images[i].value,
        loaded: 0,
        total: 0,
      };
    }
    this.state.numUpload = props.data.images.length;
    console.log(this.state);
  }

  onAddUpload = (e) => {
    e.preventDefault();
    e.persist();
    this.setState({
      numUpload: this.state.numUpload + 1,
    });
    this.setState(
      (prevState) => {
        let files = { ...prevState.files };
        files[Object.keys(files).length] = {
          loaded: 0,
          total: 0,
        };
        return { files };
      },
      () => {
        console.log(this.state);
      }
    );
  };

  uploadChildCallback = (fileObj) => {
    this.setState(
      (prevState) => {
        let files = { ...prevState.files };
        files[fileObj["num"]] = {
          ...prevState.files[fileObj["num"]],
          name: fileObj["name"],
          file: fileObj["file"],
        };
        return { files };
      },
      () => {
        console.log(this.state);
      }
    );
  };

  setFileProgress = (progressObj) => {
    this.setState(
      (prevState) => {
        let files = { ...prevState.files };
        files[progressObj.num] = {
          ...prevState.files[progressObj.num],
          loaded: progressObj.loaded,
          total: progressObj.total,
        };
        return { files };
      },
      () => {
        console.log(this.state);
      }
    );
  };

  formatCID = (cid) => {
    // // return "https://gateway.estuary.tech/gw/ipfs/" + cid
    return "https://api.estuary.tech/gw/ipfs/" + cid
    // return "https://ipfs.io/ipfs/" + cid;
  };

  uploadMetadata = (metadata) => {
    return new Promise((resolve) => {
      const formData = new FormData();
      // formData.append("data", e.target.files[0]);
      console.log(metadata);
      // formData.append("data", JSON.stringify(metadata));
      const metadataString = JSON.stringify(metadata);
      console.log(metadataString);
      const metadataBlob = new Blob([metadataString], {
        type: "application/json",
      });
      formData.append("data", metadataBlob);
      formData.append("filename", metadata.name);
      // console.log(metadataBlob)
      // console.log(formData)

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          let cid = JSON.parse(xhr.responseText).cid;
          cid = this.formatCID(cid);
          console.log(cid);
          this.setState({ metadata: cid }, () => {
            // console.log(this.state)
            console.log(this.state.metadata);
            resolve({
              metadataCID: this.state.metadata,
            });
          });
        }
      }.bind(this);

      xhr.open(
        "POST",
        // "http://localhost:3004/content/add"
      "https://api.estuary.tech/content/add"
        // "https://upload.estuary.tech/content/add"
      );
      xhr.setRequestHeader(
        "Authorization",
        // "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
        "Bearer " + process.env.REACT_APP_LIVE_ESTUARY
      );
      xhr.send(formData);
    });
  };

  upload = (fileKey) => {
    return new Promise((resolve) => {
      console.log(!("file" in this.state.files[fileKey]));
      if (!("file" in this.state.files[fileKey])) {
        console.log(!("file" in this.state.files[fileKey]));
        resolve({
          name: this.state.files[fileKey].name,
          cid: this.state.files[fileKey].cid,
        });
      } else {
        const formData = new FormData();
        // formData.append("data", e.target.files[0]);
        const file = this.state.files[fileKey]["file"];
        console.log(file);
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
            total: event.total,
          });
        };

        xhr.onreadystatechange = function () {
          if (xhr.readyState === XMLHttpRequest.DONE) {
            let cid = JSON.parse(xhr.responseText).cid;
            cid = this.formatCID(cid);
            console.log(cid);
            this.setState(
              (prevState) => {
                let files = { ...prevState.files };
                files[fileKey] = {
                  ...prevState.files[fileKey],
                  cid: cid,
                };
                return { files };
              },
              () => {
                // console.log(this.state)
                console.log(this.state.files, fileKey);
                resolve({
                  name: this.state.files[fileKey].name,
                  cid: this.state.files[fileKey].cid,
                });
              }
            );
          }
        }.bind(this);
        xhr.open(
          "POST",
          // "http://localhost:3004/content/add"
      "https://api.estuary.tech/content/add"
          // "https://upload.estuary.tech/content/add"
        );
        xhr.setRequestHeader(
          "Authorization",
          // "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
          "Bearer " + process.env.REACT_APP_LIVE_ESTUARY
        );
        xhr.send(formData);
      }
    });
  };

  uploadAll = () => {
    let uploadPromises = [];
    for (const fileKey in this.state.files) {
      uploadPromises.push(this.upload(fileKey));
    }
    return Promise.all(uploadPromises);
  };

  mint = (e) => {
    e.preventDefault();
    e.persist();
    this.uploadAll().then((uploadResults) => {
      // const name = this.state.name;
      // const description = this.state.description;
      // const price = this.state.price;
      // const fileURL = this.state.fileURL;
      // const { name, description, price, fileURL } = this.state;
      console.log(uploadResults);
      console.log(this.state);
      // for (var upload in uploadResults) {
      // uploadResults[upload]["cid"] = "ipfs://" + uploadResults[upload]["cid"];
      // }
      const metadata = {
        description: this.state.description,
        image: uploadResults[0]["cid"],
        name: this.state.name,
        attributes: [],
      };
      for (var upload in uploadResults) {
        metadata.attributes.push({
          trait_type: uploadResults[upload]["name"],
          value: uploadResults[upload]["cid"],
        });
      }
      console.log(metadata);
      this.uploadMetadata(metadata).then((metadataResult) => {
        console.log(metadataResult);
        // TODO: callback function in NFT
        // page to call modifyToken //
        // this.createNFT(metadataResult.metadataCID);
        this.props.metaCallback(metadataResult.metadataCID);
      });
    });
  };

  async createNFT(metadataCID) {
    //Upload data to IPFS
    try {
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // updateMessage("Please wait.. uploading (upto 5 mins)")
      this.setState({
        msg: "Please confirm the mint transaction and then wait for the transaction to finish.",
      });

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //actually create the NFT
      let transaction = await contract.createToken(
        this.state.recipient,
        metadataCID
      );
      await transaction.wait();

      // alert("Successfully listed your NFT!");
      // updateMessage("");
      this.setState({
        msg: "Successfully created your NFT.",
      });
      // updateFormParams({ name: '', description: '', price: ''});
      // window.location.replace("/")
      // }
    } catch (e) {
      // alert("Upload error" + e);
      this.setState({
        msg: "Upload error" + e,
      });
    }
  }

  render() {
    const uploadChildren = [];

    for (var i = 0; i < this.state.numUpload; i += 1) {
      uploadChildren.push(
        <Upload
          key={i}
          num={i}
          uploadChildCallback={this.uploadChildCallback}
          name={this.state.files[i].name}
          loaded={this.state.files[i].loaded}
          total={this.state.files[i].total}
        />
      );
    }

    return (
      <div className="">
        <div className="flex flex-col place-items-center mt-4" id="nftForm">
          <form className="shadow-md rounded mb-4 pr-8">
            <div>
              <label
                className="block
                text-purple-500
                font-bold mb-2"
                htmlFor="image"
              >
                Upload Images
              </label>
              {uploadChildren}
            </div>
            <button
              className="font-bold mt-4
                  bg-purple-500 text-white rounded p-2
              shadow-lg"
              onClick={this.onAddUpload}
            >
              Add File
            </button>

            <br></br>
            <div className="text-green text-center">{this.state.msg}</div>
            <button
              onClick={this.mint}
              className="font-bold mt-10 w-full
                  bg-purple-500 text-white rounded p-2
              shadow-lg"
            >
              List NFT
            </button>
          </form>
        </div>
      </div>
    );
  }
}

export default UpdateImages;
