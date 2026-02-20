# Astronofty

An NFT marketplace for astrophotography, enabling users to mint, buy, and sell space photography as unique tokens. Built for UofTHacks where it placed **2nd overall**.

![React](https://img.shields.io/badge/React-18-blue)
![Solidity](https://img.shields.io/badge/Solidity-0.8.4-purple)
![Ethereum](https://img.shields.io/badge/Ethereum-Goerli-green)
![IPFS](https://img.shields.io/badge/IPFS-Estuary-orange)

![astronofty-front-page](https://user-images.githubusercontent.com/25857736/214691436-26564c14-f7e0-45d0-9864-d2b0e4c08e43.png)

## Demo

[Watch the demo video](https://youtu.be/fRc4_yx4ONE) | [Devpost Submission](https://devpost.com/software/astronofty)

## Overview

Astronofty is a full-stack NFT marketplace specifically designed for the r/astrophotography community (2.6M+ members). Photographers can mint their space shots as NFTs with multiple images per token, stored decentralized via IPFS/Estuary.

## Features

- **NFT Minting** - Create NFTs with multiple images per token
- **Marketplace** - Buy/sell astrophotography NFTs with ETH pricing
- **Multi-Image Support** - Upload multiple images per NFT with carousel display
- **User Profiles** - View owned and listed NFTs
- **Price Management** - Update pricing and metadata
- **Decentralized Storage** - Photos pinned via Estuary/IPFS
- **Transaction History** - Etherscan integration for transparency

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, React Router 6, Tailwind CSS |
| **Smart Contracts** | Solidity 0.8.4, OpenZeppelin ERC721 |
| **Blockchain** | Ethereum (Goerli testnet), Hardhat |
| **Web3** | Ethers.js, Web3Modal, MetaMask |
| **Storage** | IPFS via Estuary/Pinata |
| **API** | Alchemy SDK |

## Project Structure

```
astronofty/
├── contracts/
│   └── NFTMarketplace.sol    # ERC721 marketplace contract
├── src/
│   ├── components/
│   │   ├── Marketplace.js    # NFT listing display
│   │   ├── CreateNFT.js      # Minting interface
│   │   ├── Profile.js        # User profile page
│   │   ├── NFTpage.js        # Individual NFT details
│   │   └── MultUpload.js     # Multi-image upload
│   ├── pinata.js             # IPFS upload functions
│   └── Marketplace.json      # Contract ABI
├── scripts/
│   └── deploy.js             # Contract deployment
└── hardhat.config.js         # Network configuration
```

## Installation

### Prerequisites
- Node.js and npm
- MetaMask browser extension
- Pinata account (for IPFS)
- Alchemy API key

### Setup

```bash
# Clone and install
git clone git@github.com:Kevin-Mok/astronofty.git
cd astronofty
npm install

# Create .env file with:
REACT_APP_PINATA_KEY=your_pinata_key
REACT_APP_PINATA_SECRET=your_pinata_secret
REACT_APP_ALCHEMY_API_URL=your_alchemy_url
REACT_APP_PRIVATE_KEY=your_wallet_private_key

# Deploy contract
npx hardhat run scripts/deploy.js --network goerli

# Start development server
npm start
```

## Why This Project is Interesting

### Technical Highlights

1. **Full-Stack Web3 Development**
   - React frontend with MetaMask integration
   - Solidity smart contracts with OpenZeppelin
   - IPFS decentralized storage via Estuary

2. **Complex NFT Features**
   - Multi-image NFTs with carousel display
   - Dynamic pricing and metadata updates
   - Marketplace buy/sell functionality

3. **Hackathon-Winning Architecture**
   - Built and deployed in 48 hours
   - 2nd place overall at UofTHacks
   - Production-ready marketplace features

4. **Decentralization Focus**
   - IPFS for permanent photo storage
   - Smart contract ownership verification
   - Transparent transaction history

### Skills Demonstrated

- **Web3 Development**: Solidity, Hardhat, Ethers.js
- **React Development**: Hooks, state management, routing
- **Smart Contracts**: ERC721, OpenZeppelin, marketplace logic
- **IPFS Integration**: Pinata, Estuary, decentralized storage
- **Rapid Prototyping**: Hackathon development, MVP delivery

## Inspiration

Found the r/astrophotography subreddit with 2.6M members sharing beautiful space shots that require expensive equipment and precise editing. Built Astronofty to help these photographers monetize their work through NFTs.

## Resume-ready points by variant

### `general`
- Built a full-stack NFT marketplace for astrophotography with minting, trading, and profile workflows, earning second place at UofTHacks.
- Delivered decentralized media handling through IPFS and Estuary plus transparent transaction history for trust-centered marketplace operations.

### `web-dev`
- Implemented React marketplace interfaces with multi-image NFT carousels, pricing controls, and profile-based listing management.
- Built user-facing flows for minting, buying, and metadata updates with responsive Tailwind styling and route-driven state.

### `aws`
- Architected decentralized-storage and blockchain-integrated workflows with deployment-ready service boundaries for cloud-hosted Web3 platforms.
- Structured API and frontend contracts for reliable operation under marketplace traffic, mirroring cloud reliability patterns.

### `python`
- Designed metadata processing and marketplace data contracts that translate cleanly to Python backend services and indexing pipelines.
- Built modular feature boundaries that align with Python task processing for NFT ingestion, ranking, and analytics extensions.

### `aws-web-dev`
- Combined polished React product delivery with infrastructure-aware integration across blockchain, storage, and API dependencies.
- Balanced rapid web iteration with operational discipline required for reliable cloud-hosted marketplace experiences.

### `aws-python`
- Implemented integration-heavy NFT workflows that map naturally to Python cloud services handling metadata and event processing.
- Prioritized clear contracts between UI, storage, and chain interactions for scalable Python and cloud migration paths.

### `web-dev-django`
- Built transactional marketplace flows and profile-driven views that map well to Django-backed ecommerce-style applications.
- Structured feature boundaries for clean integration with Django models, APIs, and admin-facing operational tooling.

### `it-support`
- Added transparent transaction-history surfaces and profile context that improve troubleshooting for buyers, sellers, and operators.
- Built user flows with clear state changes, reducing ambiguity during support conversations around minting and listing issues.

### `it-support-aws`
- Designed integration boundaries that help support engineers isolate failures across storage, chain, and frontend layers in hosted environments.
- Emphasized observability-ready flow segmentation for faster incident triage in cloud-like operational settings.

### `sales`
- Framed astrophotography monetization with a compelling marketplace narrative, supporting persuasive demos and stakeholder buy-in.
- Coupled technical depth with user-visible trust features, strengthening conversion conversations in creator-focused communities.

### `call-centre`
- Built clarity-first purchase and listing experiences that reduce confusion and repetitive support requests during high-volume periods.
- Standardized user flow states so support teams can communicate next steps consistently across transaction issues.

## Author

[Kevin Mok](https://github.com/Kevin-Mok)
