import UpdateImages from "./UpdateImages";
import Navbar from "./Navbar";
import axie from "../tile.jpeg";
import { useLocation, useParams } from "react-router-dom";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState, useEffect } from "react";
import alchemy from "./Alchemy";
import { Carousel } from "react-responsive-carousel";
import styles from "react-responsive-carousel/lib/styles/carousel.min.css";
// var Carousel = require('react-responsive-carousel').Carousel;

export const shortenAddress = (addr) => {
  return (
    addr.substring(0, 5) + "..." + addr.substring(addr.length - 4, addr.length)
  );
};

export const getGoerliLink = (txnHash) => {
  return "https://goerli.etherscan.io/tx/" + txnHash;
};

export const fetchedPriceToEth = (wei) => {
  const weiInt = parseInt(wei._hex);
  const eth = weiInt / Math.pow(10, 18);
  console.log(eth);
  return eth;
};

export const getNFTData = async (tokenId) => {
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
  console.log(tokenURI);
  const listedToken = await contract.getListedTokenForId(tokenId);
  console.log(listedToken);
  // let owner = ""
  let meta = await axios.get(tokenURI);
  console.log(meta);
  meta = meta.data;
  console.log(listedToken);

  let item = {
    // price: meta.price,
    tokenId: tokenId,
    owner: "",
    image: meta.image,
    images: Object.values(meta.attributes),
    name: meta.name,
    description: meta.description,
    metadata: tokenURI,
  };
  console.log(item);
  return {
    addr: addr,
    item: item,
    listedToken: listedToken,
  };
};

export default function NFTPage(props) {
  const [data, updateData] = useState({ owner: "", images: [] });
  // const [userData, updateUserData] = useState({ owner: "", images: [] });
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState();
  // const [message, updateMessage] = useState("Please confirm the mint transaction and then wait for the transaction to finish.");
  const [txn, updateTxn] = useState({ txn: false, txnLink: "" });
  // const [txn, updateTxn] = useState({ txn: true, txnLink: "https://goerli.etherscan.io/tx/0xd8a758071c0fa625c2ae48fa036a5833fa7c2c74291735ba98228f15ee1a53fb" });
  const [currAddress, updateCurrAddress] = useState("0x");
  const [price, updatePrice] = useState(0);
  const [userPrice, updateUserPrice] = useState("1");

  const notListedStr = "not listed";

  // useEffect(() => {
  // console.log(currAddress, data.owner)
  // }, [data]);

  async function updateNFTData(tokenId) {
    const { item, listedToken, addr } = await getNFTData(tokenId);
    updateData(item);
    // updateUserData(item);
    if (listedToken.currentlyListed) {
      updatePrice(fetchedPriceToEth(listedToken.price));
    } else {
      updatePrice(notListedStr);
    }
    console.log(price);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr.toLowerCase());
    // Print total NFT count returned in the response:
    alchemy.nft
      .getOwnersForNft(MarketplaceJSON.address, tokenId)
      .then((ownersResult) => {
        console.log(ownersResult);
        item.owner = ownersResult.owners[0];
        updateData({ ...item });
        console.log(currAddress, data.owner);
      });
  }

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
      // const salePrice = ethers.utils.parseUnits(price, "ether");
      const salePrice = BigInt(price * Math.pow(10, 18));
      updateMessage(
        "Please confirm the buy transaction and then wait for the transaction to finish."
      );
      //run the executeSale function
      let transaction = await contract.executeSale(tokenId, {
        value: salePrice,
      });
      updateTxn({
        txn: true,
        txnLink: getGoerliLink(transaction.hash),
      });
      await transaction.wait();
      updateMessage("You successfully bought the NFT.");
      updateTxn({ txn: false });
      await updateNFTData(tokenId);
      // awaitTxn(transaction, "You successfully bought the NFT.")
    } catch (e) {
      updateMessage("" + e);
    }
  }

  async function editNFT(metadataLink) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(metadataLink);

      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(userPrice, "ether");
      updateMessage(
        "Please confirm the edit transaction and then wait for the transaction to finish."
      );
      //run the executeSale function
      console.log(tokenId, metadataLink, salePrice);
      let transaction = await contract.modifyToken(
        tokenId,
        metadataLink,
        salePrice
      );
      console.log(transaction);
      updateTxn({
        txn: true,
        txnLink: getGoerliLink(transaction.hash),
      });
      await transaction.wait();
      updateMessage("You successfully listed your NFT.");
      updateTxn({ txn: false });
      await updateNFTData(tokenId);
      // awaitTxn(transaction, "You successfully listed your NFT.")
    } catch (e) {
      updateMessage("" + e);
    }
  }

  const openImg = (index, image) => {
    // console.log(index, image)
    // window.open(image.value, '_blank', 'noreferrer');
    window.open(data.images[index].value, "_blank", "noreferrer");
  };

  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) updateNFTData(tokenId);

  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div className="flex ml-20 mt-20 justify-center">
        <Carousel className="w-1/2" showArrows={true} onClickItem={openImg}>
          {data.images.map((image) => {
            return (
              <div>
                <img className="bg-white" src={image.value} />
                <p className="legend">{image.trait_type}</p>
              </div>
            );
          })}
        </Carousel>
        <div
          className="text-xl w-1/3 ml-20
          space-y-8 text-white shadow-2xl
          rounded-lg border-2 p-5 h-min"
        >
          <span>Token ID: {data.tokenId}</span>
          <a href={data.metadata} target="_blank">
            <button
              className="btn font-bold inline ml-5
                  bg-purple-500 text-white rounded p-2
              shadow-lg"
            >
              Metadata
            </button>
          </a>
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Owner:
            {currAddress == data.owner ? (
              <span className="text-purple-500">&nbsp;you</span>
            ) : (
              <span>&nbsp;{shortenAddress(data.owner)}</span>
            )}
          </div>
          <div>
            Price: <span className="">{price}</span>
            <span className="">{price != notListedStr ? " ETH" : ""}</span>
          </div>
          {currAddress == data.owner ? (
            <div>
              <span>List: </span>
              <input
                className="shadow appearance-none
                  border rounded w-20 py-2 px-3
              text-gray-700 leading-tight focus:outline-none
              focus:shadow-outline"
                id="name"
                type="text"
                placeholder="1"
                onChange={(e) => {
                  updateUserPrice(e.target.value);
                }}
                value={userPrice}
              ></input>
              <span>&nbsp;ETH</span>
              <UpdateImages data={data} metaCallback={editNFT} />
            </div>
          ) : (
            <span>{""}</span>
          )}
          {price != notListedStr && currAddress != data.owner ? (
            <button
              className="btn font-bold
                  bg-purple-500 text-white rounded p-2
              shadow-lg"
              // className="enableEthereumButton
              // bg-blue-500 hover:bg-blue-700
              // text-white font-bold py-2 px-4
              // rounded"
              onClick={() => buyNFT(tokenId)}
            >
              Buy NFT
            </button>
          ) : (
            <span></span>
          )}
          {txn.txn == false ? (
            <div className="text-white text-center">{message}</div>
          ) : (
            <div className="text-center mr-5">
              <a
                href={txn.txnLink}
                className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                target="_blank"
              >
                Transaction Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// <button
// className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
// onClick={() => listNFT(tokenId)}
// >
// List NFT
// </button>
// class="btn btn-blue bg-blue-500 p-2 text-sm">
// className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
// <Carousel className="h-1/2 custom-carousel w-1/2 max-h-screen" showArrows={true} onClickItem={openImg}>
