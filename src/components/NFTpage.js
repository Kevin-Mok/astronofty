import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import alchemy from "./Alchemy";
import { Carousel } from 'react-responsive-carousel'
import styles from 'react-responsive-carousel/lib/styles/carousel.min.css';
// var Carousel = require('react-responsive-carousel').Carousel;

export default function NFTPage(props) {
  const [data, updateData] = useState({ images: [] });
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [currAddress, updateCurrAddress] = useState("0x");
  const [price, updatePrice] = useState(0);

  // useEffect(() => {
    // console.log(currAddress, data.owner)
  // }, [data]);

  const fetchedPriceToEth = (wei) => { 
    const weiInt = parseInt(wei._hex)
    const eth = weiInt / Math.pow(10, 18)
    console.log(eth)
    return eth
  }

  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token
    const tokenURI = await contract.tokenURI(tokenId);
    console.log(tokenURI)
    const listedToken = await contract.getListedTokenForId(tokenId);
    console.log(listedToken)
    // let owner = ""
    let meta = await axios.get(tokenURI);
    console.log(meta)
    meta = meta.data;
    console.log(listedToken);

    let item = {
      // price: meta.price,
      tokenId: tokenId,
      seller: listedToken.seller,
      owner: "",
      image: meta.image,
      images: Object.values(meta.attributes),
      name: meta.name,
      description: meta.description,
      metadata: tokenURI
    };
    console.log(item);
    updateData(item);
    updatePrice(fetchedPriceToEth(listedToken.price));
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr.toLowerCase());
    // Print total NFT count returned in the response:
    alchemy.nft.getOwnersForNft(MarketplaceJSON.address, tokenId).then((ownersResult) => { 
      console.log(ownersResult)
      item.owner = ownersResult.owners[0]
      updateData({... item});
      console.log(currAddress, data.owner)
    });
  }

  // TODO: add list button to createListedToken,
  // price input field, placeholder current
  // price //
  async function listNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(price, "ether");
      updateMessage("Please confirm the list transaction and then wait for the transaction to finish.");
      //run the executeSale function
      let transaction = await contract.createListedToken(tokenId, salePrice);
      await transaction.wait();
      updateMessage("You successfully listed your NFT.");
    } catch (e) {
      updateMessage("Upload Error" + e);
    }
  }

  // TODO: add buy button to executeSale
  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      await transaction.wait();

      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  // TODO: add edit buttons to edit
  // images/names, another page?

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20">
        <Carousel showArrows={true}>
          {data.images.map((image) => {
            return (
            <div>
              <img src={image.value} />
              <p className="legend">{image.trait_type}</p>
            </div>)
          })}
        </Carousel>
        <div className="text-xl w-1/3 ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5">
          <div>Token ID: {data.tokenId}</div>
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <a href={data.metadata} target="_blank">
            <button class="btn btn-blue bg-blue-500 p-2 text-sm">Metadata</button>
          </a>
          <div>
            Owner: 
            {currAddress == data.owner ? (
              <span className="text-emerald-700">
                &nbsp;you
              </span>
            ) : (
              <span className="text-sm">&nbsp;{data.owner}</span>
            )}
          </div>
              <div>
                Price: <span className="">{price + " ETH"}</span>
              </div>
              <input
                className="shadow appearance-none
                  border rounded w-20 py-2 px-3
              text-gray-700 leading-tight focus:outline-none
              focus:shadow-outline"
                id="name"
                type="text"
                placeholder="iPhone 14"
                onChange={(e) => { updatePrice(e.target.value); }}
                value={price}
              ></input>
              <span>&nbsp;ETH</span>
          <br/>
              <button
                className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                onClick={() => listNFT(tokenId)}
              >
                List NFT
              </button>
          <div>
            {currAddress == data.owner || currAddress == data.seller ? (
              <span></span>
            ) : (
            <div>
            </div>
            )}
            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
              // <input type="button" class="button" value="Metadata" />
