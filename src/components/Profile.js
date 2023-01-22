import Navbar from "./Navbar";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import NFTTile from "./NFTTile";
// import { Alchemy, Network } from "alchemy-sdk";
import alchemy from "./Alchemy";

import { getNFTData, fetchedPriceToEth, shortenAddress } from "./NFTpage.js";

// const config = {
// apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
// network: Network.ETH_GOERLI,
// };
// const alchemy = new Alchemy(config);

export default function Profile() {
  const [data, updateData] = useState([]);
  const [dataFetched, updateFetched] = useState(false);
  const [address, updateAddress] = useState("0x");

  async function getAllNFTs(tokenId) {
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
    // let transaction = await contract.getMyNFTs();
    // const nfts = await alchemy.nft.getNftsForOwner(addr);
    let latestTokenId = await contract.getCurrentToken();
    latestTokenId = parseInt(latestTokenId._hex, 16);
    console.log(latestTokenId);
    // console.log(addr)
    // console.log(nfts.ownedNfts[0])

    /*
     * Below function takes the metadata from tokenURI and the data returned by getMyNFTs() contract function
     * and creates an object of information that is to be displayed
     */
    let items = [];
    for (let i = 1; i < latestTokenId + 1; i++) {
      const ownerAddr = await contract.ownerOf(i);
      if (ownerAddr == addr) {
        const tokenObj = await getNFTData(i);
        const listedToken = await contract.getListedTokenForId(i);
        console.log(tokenObj);
        const item = tokenObj.item;
        // console.log(tokenObj.item.metadata)
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
    updateAddress(addr);
  }

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getAllNFTs(tokenId);

  return (
    <div className="profileClass" style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="profileClass">
        <div className="flex flex-col text-center items-center mt-11 text-white">
          <h2 className="font-bold text-3xl mb-2">Your NFT's</h2>
          <div className="flex justify-center flex-wrap max-w-screen-xl">
            {data.map((value, index) => {
              return <NFTTile data={value} key={index}></NFTTile>;
            })}
          </div>
          <div className="mt-10">
            {!dataFetched ? "Loading your NFT's..." : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
