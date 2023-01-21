import Navbar from "./Navbar";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import React from "react";

import Upload from "./Upload";
import MultUpload from "./MultUpload";

const ethers = require("ethers");

// export default function SellNFT () {
class SellNFT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: "",
      fileURL: null,
      msg: "",
      numUpload: 1,
      files: {
        0: {
          loaded: 0,
          total: 0,
        },
      },
    };
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

  uploadMetadata = (metadata) => {
    return new Promise((resolve) => {
      const formData = new FormData();
      // formData.append("data", e.target.files[0]);
      console.log(metadata);
      // formData.append("data", JSON.stringify(metadata));
      const metadataString = JSON.stringify(metadata)
      console.log(metadataString)
      const metadataBlob = new Blob([metadataString],{type:'application/json'})
      formData.append("data", metadataBlob);
      // console.log(metadataBlob)
      // console.log(formData)

      const xhr = new XMLHttpRequest();

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          const cid = JSON.parse(xhr.responseText).cid;
          console.log(cid);
          this.setState({ metadata: cid },
            () => {
              // console.log(this.state)
              console.log(this.state.metadata);
              // this.uploadMetadataToIPFS(metadata)
              resolve({
                metadata: this.state.metadata,
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
    });
  };

  upload = (fileKey) => {
    return new Promise((resolve) => {
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
          const cid = JSON.parse(xhr.responseText).cid;
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
        // "https://upload.estuary.tech/content/add"
      "https://api.estuary.tech/content/add"
      );
      xhr.setRequestHeader(
        "Authorization",
        // "Bearer " + process.env.REACT_APP_LOCAL_ESTUARY
        "Bearer " + process.env.REACT_APP_LIVE_ESTUARY
      );
      xhr.send(formData);
    });
  };

  //This function uploads the NFT image to IPFS
  async OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL);
        // setFileURL(response.pinataURL);
        this.setState({
          fileURL: response.pinataURL,
        });
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to IPFS
  // async uploadMetadataToIPFS() {
    // // const {name, description, price} = formParams;
    // const name = this.state.name;
    // const description = this.state.description;
    // const price = this.state.price;
    // const fileURL = this.state.fileURL;
    // //Make sure that none of the fields are empty
    // if (!name || !description || !price || !fileURL) return;

    // const nftJSON = {
      // name,
      // description,
      // price,
      // image: fileURL,
    // };

    // try {
      // //upload the metadata JSON to IPFS
      // const response = await uploadJSONToIPFS(nftJSON);
      // if (response.success === true) {
        // console.log("Uploaded JSON to Pinata: ", response);
        // return response.pinataURL;
      // }
    // } catch (e) {
      // console.log("error uploading JSON metadata:", e);
    // }
  // }
  async uploadMetadataToIPFS(metadata) {
    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(metadata);
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

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
      for (var upload in uploadResults) {
        uploadResults[upload]["cid"] = "ipfs://" + uploadResults[upload]["cid"];
      }
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
      this.uploadMetadata(metadata).then(metadataResult => { 
        console.log(metadataResult)
      })
    });
  };

  async listNFT(e) {
    e.preventDefault();

    //Upload data to IPFS
    try {
      const metadataURL = await this.uploadMetadataToIPFS();
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      // updateMessage("Please wait.. uploading (upto 5 mins)")
      this.setState({
        msg: "Please wait.. uploading (upto 5 mins)",
      });

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        Marketplace.address,
        Marketplace.abi,
        signer
      );

      //massage the params to be sent to the create NFT request
      // const price = ethers.utils.parseUnits(formParams.price, 'ether')
      const price = ethers.utils.parseUnits(this.state.price, "ether");
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();

      //actually create the NFT
      let transaction = await contract.createToken(metadataURL, price, {
        value: listingPrice,
      });
      await transaction.wait();

      alert("Successfully listed your NFT!");
      // updateMessage("");
      this.setState({
        msg: "Please wait.. uploading (upto 5 mins)",
        name: "",
        description: "",
        price: "",
      });
      // updateFormParams({ name: '', description: '', price: ''});
      // window.location.replace("/")
      // }
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  // console.log("Working", process.env);
  render() {
    const uploadChildren = [];

    for (var i = 0; i < this.state.numUpload; i += 1) {
      uploadChildren.push(
        <Upload
          key={i}
          num={i}
          uploadChildCallback={this.uploadChildCallback}
          loaded={this.state.files[i].loaded}
          total={this.state.files[i].total}
        />
      );
    }

    return (
      <div className="">
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
          <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
            <h3 className="text-center font-bold text-purple-500 mb-8">
              Upload your NFT to the marketplace
            </h3>
            <div className="mb-4">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="name"
              >
                NFT Name
              </label>
              <input
                className="shadow appearance-none
                  border rounded w-full py-2 px-3
              text-gray-700 leading-tight focus:outline-none
              focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Axie#4563"
                onChange={(e) => {
                  this.setState({
                    name: e.target.value,
                  });
                }}
                value={this.state.name}
              ></input>
            </div>
            <div className="mb-6">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="description"
              >
                NFT Description
              </label>
              <textarea
                className="shadow
                  appearance-none border rounded w-full py-2
              px-3 text-gray-700 leading-tight
                  focus:outline-none focus:shadow-outline"
                cols="40"
                rows="5"
                id="description"
                type="text"
                placeholder="Axie Infinity
                  Collection"
                value={this.state.description}
                onChange={(e) =>
                  this.setState({
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="mb-6">
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Price (in ETH)
              </label>
              <input
                className="shadow appearance-none
                  border rounded w-full py-2 px-3
                  text-gray-700 leading-tight
                  focus:outline-none focus:shadow-outline"
                type="number"
                placeholder="Min 0.01 ETH"
                step="0.01"
                value={this.state.price}
                onChange={(e) =>
                  // updateFormParams({...formParams, price:
                  // e.target.value})}>
                  this.setState({
                    price: e.target.value,
                  })
                }
              ></input>
            </div>
            <div>
              <label
                className="block text-purple-500 text-sm font-bold mb-2"
                htmlFor="image"
              >
                Upload Image
              </label>
              {uploadChildren}
            </div>
            <button
              className="font-bold mt-10
                  bg-purple-500 text-white rounded p-2
              shadow-lg"
              onClick={this.onAddUpload}
            >
              Add File
            </button>

            <br></br>
            <div className="text-green text-center">{this.state.message}</div>
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

export default SellNFT;
