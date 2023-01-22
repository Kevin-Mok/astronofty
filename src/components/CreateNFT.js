import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import { useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import Marketplace from "../Marketplace.json";
import { useLocation } from "react-router";
import React from "react";

import Upload from "./Upload";
import { getGoerliLink } from "./NFTpage";

const ethers = require("ethers");

// export default function SellNFT () {
class CreateNFT extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      description: "",
      price: "",
      fileURL: null,
      msg: "",
      // msg: "Please confirm the mint transaction and then wait for the transaction to finish.",
      txn: {
        txn: false,
        txnLink: "",
        // txn: true,
        // txnLink: "https://goerli.etherscan.io/tx/0xd8a758071c0fa625c2ae48fa036a5833fa7c2c74291735ba98228f15ee1a53fb"
      },
      toToken: {
        // pathname: "/nftPage/1"
      },
      recipient: "",
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

  formatCID = (cid) => {
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
        this.createNFT(metadataResult.metadataCID);
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
        // this.state.recipient,
        metadataCID,
        BigInt(this.state.price * Math.pow(10, 18))
      );
      this.setState({
        txn: {
          txn: true,
          txnLink: getGoerliLink(transaction.hash),
        },
      });
      await transaction.wait();
      // console.log(transaction)

      // alert("Successfully listed your NFT!");
      // updateMessage("");
      this.setState({
        // msg: "Successfully created the NFT.",
        msg: "",
        txn: {
          txn: false,
        },
      });
      const curTokenId = await contract.getCurrentToken();
      console.log(curTokenId);
      this.setState({
        toToken: {
          pathname: "/nftPage/" + curTokenId,
        },
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
          loaded={this.state.files[i].loaded}
          total={this.state.files[i].total}
        />
      );
    }

    return (
      <div className="">
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-10" id="nftForm">
          <form className="shadow-md rounded px-8 pt-4 pb-8 mb-4 text-xl max-w-2xl">
            <div className="text-center text-3xl font-bold text-purple-500 mb-8">
              Create An NFT
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 font-bold mb-2 text-med"
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
                placeholder="Tadpole Nebula"
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
                className="block text-purple-500 font-bold mb-2"
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
                placeholder="The Tadpole Nebula is a region of ionised hydrogen gas spanning over 100 lightyears..."
                value={this.state.description}
                onChange={(e) =>
                  this.setState({
                    description: e.target.value,
                  })
                }
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                className="block text-purple-500 font-bold mb-2"
                htmlFor="name"
              >
                NFT Price (ETH)
              </label>
              <input
                className="shadow appearance-none
                  border rounded w-full py-2 px-3
              text-gray-700 leading-tight focus:outline-none
              focus:shadow-outline"
                id="name"
                type="text"
                placeholder="0.05"
                onChange={(e) => {
                  this.setState({
                    price: e.target.value,
                  });
                }}
                value={this.state.price}
              ></input>
            </div>
            <div>
              <label
                className="block text-purple-500 font-bold mb-2"
                htmlFor="image"
              >
                Upload Images
              </label>
              {uploadChildren}
            </div>
            <button
              className="font-bold
                  bg-purple-500 text-white rounded p-2
              shadow-lg mt-4"
              onClick={this.onAddUpload}
            >
              Add File
            </button>

            <br></br>
            <button
              onClick={this.mint}
              className="font-bold mt-10 w-full
                  bg-purple-500 text-white rounded p-2
                  shadow-lg"
            >
              Create NFT
            </button>
            {this.state.txn.txn == false ? (
              <div className="mt-5 text-white text-center">
                {this.state.msg}
              </div>
            ) : (
              <div className="mt-5 text-center">
                <a
                  href={this.state.txn.txnLink}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  target="_blank"
                >
                  Transaction Link
                </a>
              </div>
            )}
            {this.state.toToken.pathname ? (
              <div className="text-white text-center">
                Successfully created&nbsp;
                <Link
                  to={this.state.toToken}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                >
                  the NFT
                </Link>
                .
              </div>
            ) : (
              <div></div>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default CreateNFT;
              // <label
                // className="block text-purple-500 font-bold mb-2"
                // htmlFor="name"
              // >
                // NFT Recipient
              // </label>
              // <input
                // className="shadow appearance-none
                  // border rounded w-full py-2 px-3
              // text-gray-700 leading-tight focus:outline-none
              // focus:shadow-outline"
                // id="name"
                // type="text"
                // placeholder="0x820f57945ef2e6e880A251cfeB9770E7C89c6842"
                // onChange={(e) => {
                  // this.setState({
                    // recipient: e.target.value,
                  // });
                // }}
                // value={this.state.recipient}
              // ></input>
