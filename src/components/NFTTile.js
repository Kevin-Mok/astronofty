import axie from "../tile.jpeg";
import ethLogo from '../eth-logo.png';
// import { ReactComponent as ethLogo } from "../eth-logo.svg";
import { BrowserRouter as Router, Link } from "react-router-dom";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };
  console.log(data)
  return (
    <Link to={newTo}>
      <div className="border-2 border-black ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
        <div className="w-full pr-2 text-xl text-right text-black">{data.data.listed ? 
          (
          <div>
          <img
            src={ethLogo}
            alt=""
            className="inline pr-1 h-4 rounded-lg"
          />
            <span>{data.data.price}</span>
          </div>
          ) 
          : "Unlisted"}
        </div>
        <img
          src={data.data.image}
          alt=""
          className="w-72 h-80 rounded-lg object-cover"
        />
        <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
          <strong className="text-xl">{data.data.name}</strong>
          <p className="display-inline">{data.data.description}</p>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
