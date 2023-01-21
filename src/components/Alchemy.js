import { Alchemy, Network } from "alchemy-sdk";

const config = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(config);

export default alchemy;
