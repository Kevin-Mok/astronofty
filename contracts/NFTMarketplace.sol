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
    //The fee charged by the marketplace to be allowed to list an NFT
    // uint256 listPrice = 0.01 ether;

    //The structure to store info about a listed token
    struct ListedToken {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool currentlyListed;
    }

    //the event emitted when a token is successfully listed
    event TokenListedSuccess (
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        bool currentlyListed
    );

    //This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedToken) private idToListedToken;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        owner = payable(msg.sender);
    }

    // function updateListPrice(uint256 _listPrice) public payable {
        // require(owner == msg.sender, "Only owner can update listing price");
        // listPrice = _listPrice;
    // }

    // function getListPrice() public view returns (uint256) {
        // return listPrice;
    // }

    // function getLatestIdToListedToken() public view returns (ListedToken memory) {
        // uint256 currentTokenId = _tokenIds.current();
        // return idToListedToken[currentTokenId];
    // }

    function getListedTokenForId(uint256 tokenId) public view returns (ListedToken memory) {
        return idToListedToken[tokenId];
    }

    function getCurrentToken() public view returns (uint256) {
        return _tokenIds.current();
    }

    //The first time a token is created, it is listed here
    // function createToken(string memory tokenURI, uint256 price) public payable returns (uint) {
    function createToken(address recipient, string memory tokenURI) public returns (uint) {
        //Increment the tokenId counter, which is keeping track of the number of minted NFTs
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        //Mint the NFT with tokenId newTokenId to the address who called createToken
        // _safeMint(msg.sender, newTokenId);
        _safeMint(recipient, newTokenId);

        //Map the tokenId to the tokenURI (which is an IPFS URL with the NFT metadata)
        _setTokenURI(newTokenId, tokenURI);

        //Helper function to update Global variables and emit an event
        // createListedToken(newTokenId, price);

        return newTokenId;
    }

    function createListedToken(uint256 tokenId,
                               uint256 price)
                               public {
        //Make sure the sender sent enough ETH to pay for listing
        // require(msg.value == listPrice, "Hopefully sending the correct price");
        //Just sanity check
        require(msg.sender == ownerOf(tokenId),
                "Make sure only owner of token can list");
        require(price > 0, "Make sure the price isn't negative");

        //approve the marketplace to sell NFTs on your behalf
        // approve(address(this), tokenId);
        setApprovalForAll(address(this), true);

        //Update the mapping of tokenId's to Token details, useful for retrieval functions
        idToListedToken[tokenId] = ListedToken(
            tokenId,
            payable(msg.sender),
            price,
            true
        );

        // transfer from sender to contract
        // _transfer(msg.sender, address(this), tokenId);
        //Emit the event for successful transfer. The frontend parses this message and updates the end user
        emit TokenListedSuccess(
            tokenId,
            msg.sender,
            price,
            true
        );
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
        address seller = idToListedToken[tokenId].seller;
        require(msg.value == price, "Please submit the asking price in order to complete the purchase");

        //update the details of the token
        // idToListedToken[tokenId].currentlyListed = true;
        idToListedToken[tokenId].seller = payable(msg.sender);
        _itemsSold.increment();

        //Actually transfer the token to the new owner
        // _transfer(address(this), msg.sender, tokenId);
        _transfer(seller, msg.sender, tokenId);
        //approve the marketplace to sell NFTs on your behalf
        // approve(address(this), tokenId);

        //Transfer the listing fee to the marketplace creator
        // payable(owner).transfer(listPrice);
        //Transfer the proceeds from the sale to the seller of the NFT
        payable(seller).transfer(msg.value);
    }

    //We might add a resell token function in the future
    //In that case, tokens won't be listed by default but users can send a request to actually list a token
    //Currently NFTs are listed by default
}
