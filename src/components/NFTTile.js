import axie from "../tile.jpeg";
import ethLogo from "../eth-logo.png";
// import { ReactComponent as ethLogo } from "../eth-logo.svg";
import { BrowserRouter as Router, Link } from "react-router-dom";

function NFTTile(data) {
  const newTo = {
    pathname: "/nftPage/" + data.data.tokenId,
  };
  console.log(data);
  return (
    <Link to={newTo}>
      <div
        className="border-2 border-black
        ml-12 mt-5 flex flex-col
  items-center rounded-lg w-48 md:w-72
  shadow-2xl"
      >
        <div className="absolute text-black text-xl ml-48 mt-2">
          {data.data.listed ? (
            <div className="bg-white bg-opacity-70 rounded-lg p-0.5">
              <img
                src={ethLogo}
                alt=""
                className="inline pr-1 h-5 mb-1 rounded-lg"
              />
              <span>{data.data.price}</span>
            </div>
          ) : (
            ""
          )}
        </div>
        <img
          src={data.data.image}
          alt=""
          className="w-80 h-80 rounded-lg object-cover bg-white"
        />
        <div className="text-white w-full p-2 rounded-lg pt-5">
          <strong className="text-xl">{data.data.name}</strong>
        </div>
      </div>
    </Link>
  );
}

export default NFTTile;
// <div className="w-full pr-2 text-xl text-right text-black bg-white rounded-t-lg">{data.data.listed ?
// <div className="text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
// className="w-80 h-80 rounded-lg object-scale-down bg-white"
