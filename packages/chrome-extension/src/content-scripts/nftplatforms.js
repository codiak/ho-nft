import "regenerator-runtime/runtime";
import React, { useState } from "react";
import * as ReactDOMClient from "react-dom/client";
import WriteReview from "../components/WriteReview";
import { NETWORKS } from "../components/constants";
import { fetchGReviews } from "../api";

// Set network here!
const initialNetwork = NETWORKS.goerli;

const selectedNetwork = initialNetwork.name;
const targetNetwork = NETWORKS[selectedNetwork];
var chainId = 0;
var nftTokenAddress = "";
var nftTokenId = "";

const injectReviewForm = async (address, id) => {
  console.log("injecting review form");
  const container = document
    .querySelector(".TradeStation--main")
    .parentElement.appendChild(document.createElement("div"));
  nftTokenAddress = address;
  nftTokenId = id;
  const root = ReactDOMClient.createRoot(container);
  root.render(
    <WriteReview
      limit={200}
      rows={5}
      cols={80}
      chainId={chainId}
      nftTokenAddress={nftTokenAddress}
      nftTokenId={nftTokenId}
      targetNetwork={targetNetwork}
    />
  );

  console.log("fetching reviews:");
  // grabs the area where people bid (most visibility), add our reviews immediately under it
  var biddingArea = document.querySelector(".TradeStation--main");
  // don't process if there are no reviews
  const fetchReviews = await fetchGReviews(chainId, address, id);
  console.log("fetched review: ", fetchReviews);
  for (let i = 0; i < fetchReviews?.length; i++) {
    const review = fetchReviews[i];
    console.log("review: ", review);
    const reviewsHtml = buildReviewsHtml(review);
    container.insertAdjacentHTML("afterend", reviewsHtml);
  }
  console.log("done fetching reviews");
};

const buildReviewsHtml = ({ createdAt, userName, sender, rating, review }) => {
  let html = `
    <div class="review-wrap" style="padding:0.5em;">
      <div display="inline" class="Blockreact__Block-sc-1xf18x6-0 iiEhTQ">
        <span class="row">Posted: <i>Today</i> &nbsp;&nbsp; Rating: ${"⭐".repeat(
          rating
        )}</span>
        <span class="row"><a class="styles__StyledLink-sc-l6elh8-0 hubhNL Blockreact__Block-sc-1xf18x6-0 laCjUo AccountLink--ellipsis-overflow" href="${sender}"></a></span><br/></br/>
        <span class="row" style="font-size: 15px; padding: 10px 0px;">${review}</span><br/><br/>
      </div>
      <hr/
    </div>`;
  return html;
};

const injectReviews = async (chainId, address, id) => {
  console.log("fetching reviews for: ", chainId, address, id);
  const fetchReviews = await fetchGReviews(chainId, address, id);
  console.log("fetched review: ", fetchReviews);
};

// extract NFT address and id from link
let getAddressAndId = (link) => {
  if (!link.href.includes("collection")) {
    // not processing solana
    if (link.href.includes("solana")) {
      console.log("Solana support is not yet available 😭");
      return null;
    }
    if (chainId === 0) {
      if (link.href.includes("klaytn")) {
        console.log("Chain: Klaytn");
        chainId = 8217;
      } else if (link.href.includes("matic")) {
        console.log("Chain: Matic");
        chainId = 137;
      } else {
        console.log("Chain: Ethereum");
        chainId = 1;
      }
    }
  }

  let fragments = link.href.split("/");
  let address = null;
  let id = null;
  for (let i = 0; i < fragments.length; i++) {
    let f = fragments[i];
    if (f.includes("0x")) {
      address = f;
      id = fragments[i + 1]; // id always follows address
      break;
    }
  }
  if (address !== null && id != null) {
    const key = chainId + address + id;

    console.log(
      "Processing : ",
      address + ", id: ",
      id + ", chain: ",
      chainId,
      ", key: ",
      key
    );
    return { address, id, key, chainId };
  } else {
    return null;
  }
};

// initial page load
(async function main() {
  const url = window.location;
  console.log("url:", window.location);
  const { address, id } = getAddressAndId(url) || "";
  // if address and id are found, then we are on an NFT page
  if (address && id) {
    console.log("On NFT page:");
    await injectReviewForm(address, id);

    // user on NFT page inject review area
  } else if (url.href.includes("collection")) {
    console.log("On Collection page:");
  }
})();
