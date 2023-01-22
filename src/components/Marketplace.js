import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";

import { getNFTData, fetchedPriceToEth } from "./NFTpage.js";

export default function Marketplace() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);

  async function getAllNFTs(tokenId) {
    const ethers = require("ethers");
    let sumPrice = 0;
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

    let latestTokenId = await contract.getCurrentToken();
    latestTokenId = parseInt(latestTokenId._hex, 16);
    console.log(latestTokenId);

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */
    let items = [];
    for (let i = 1; i < latestTokenId + 1; i++) {
      // console.log(tokenObj.item.metadata)
      const listedToken = await contract.getListedTokenForId(i);
      if (listedToken.currentlyListed) {
        const tokenObj = await getNFTData(i);
        console.log(tokenObj);
        const item = tokenObj.item;
        items.push({
          tokenId: item.tokenId,
          image: item.image,
          name: item.name,
          description: item.description,
          price: fetchedPriceToEth(listedToken.price),
          listed: listedToken.currentlyListed,
        });
      }
      // updateData(items);
    }

    console.log(items);

    updateData(items);
    updateFetched(true);
  }

  if (!dataFetched) getAllNFTs();

  return (
    <div>
      <Navbar></Navbar>
      <div className="flex flex-col place-items-center mt-20 w-screen">
        <div className="md:text-2xl font-bold text-white">Listed NFT's</div>
        <div className="flex mt-5 justify-center flex-wrap max-w-screen-lg text-center">
          {data.map((value, index) => {
            return <NFTTile data={value} key={index}></NFTTile>;
          })}
        </div>
        <div className="mt-10 text-white">
          {!dataFetched ? "Loading listed NFT's..." : ""}
        </div>
      </div>
    </div>
  );
}
