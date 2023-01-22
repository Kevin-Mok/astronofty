//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFTMarketplace is ERC721URIStorage {

    using Counters for Counters.Counter;
    //_tokenIds variable has the most recent minted tokenId
    Counters.Counter private _tokenIds;
    //Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;
    //owner is the contract address that created the smart contract
    address payable owner;

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 price,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    // function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
    // function createToken(address recipient, string memory tokenURI) public returns (uint) {
    function createToken(string memory tokenURI, 
                         uint256 price) public returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        _safeMint(msg.sender, newTokenId);
        // _safeMint(recipient, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId,
                               uint256 price)
                               public {
        //Just sanity check
        require(msg.sender == ownerOf(tokenId),
                "Make sure only owner of token can list");
        require(price > 0, "Make sure the price isn't negative");

        //approve the marketplace to sell NFTs on your behalf
        setApprovalForAll(address(this), true);

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(price, true);

        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(price, true);
    }
    
    function modifyToken(uint256 tokenId, string memory tokenURI, uint256 price) public {
        require(msg.sender == ownerOf(tokenId),
                "Make sure only owner can modify token");
        _setTokenURI(tokenId, tokenURI);
        idToListedToken[tokenId].price = price;
        idToListedToken[tokenId].currentlyListed = true;
    }

    //This will return all the NFTs currently listed to be sold on the marketplace
    // function getAllNFTs() public view returns (ListedToken[] memory) {
        // uint nftCount = _tokenIds.current();
        // ListedToken[] memory tokens = new ListedToken[](nftCount);
        // uint currentIndex = 0;
        // uint currentId;
        // //at the moment currentlyListed is true for all, if it becomes false in the future we will
        // //filter out currentlyListed == false over here
        // for(uint i=0;i<nftCount;i++)
        // {
            // currentId = i + 1;
            // ListedToken storage currentItem = idToListedToken[currentId];
            // tokens[currentIndex] = currentItem;
            // currentIndex += 1;
        // }
        // //the array 'tokens' has the list of all NFTs in the marketplace
        // return tokens;
    // }
    
    function executeSale(uint256 tokenId) public payable {
        uint price = idToListedToken[tokenId].price;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");
        require(idToListedToken[tokenId].currentlyListed == true, "Token must be listed to be sold.");

        //update the details of the token
        idToListedToken[tokenId].currentlyListed = false;
        _itemsSold.increment();

        //Transfer the proceeds from the sale to the seller of the NFT
        payable(ownerOf(tokenId)).transfer(msg.value);

        //Actually transfer the token to the new owner
        _transfer(ownerOf(tokenId), msg.sender, tokenId);
    }

    //We might add a resell token function in the future
    //In that case, tokens won't be listed by default but users can send a request to actually list a token
    //Currently NFTs are listed by default
}
