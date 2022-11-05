pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";
// import "@openzeppelin/contracts/access/Ownable.sol";
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract HumbleOpinion {
  struct Review {
    uint id;
    string text;
    bool ownerWhenReviewed;
    address author;
    // string collectionHash;
    string assetHash;
    uint rating;
  }

  Review[] public reviews;
  uint public reviewCount;

  // Might be able to clean this out in the future
  event NewReview(address sender, string review, uint rating, string assetHash);

  constructor() {
    // what should we do on deploy?
  }

  function create(string memory _text, bool _owned, string memory _assetHash, uint _rating) external {
      require(bytes(_text).length > 0, "Review text is empty");
      require(bytes(_assetHash).length > 0, "Asset hash is empty");
      require(msg.sender!=address(0), "Auther address does not exist");
      reviewCount = reviewCount + 1;
      Review memory newReview = Review(reviewCount, _text, _owned, msg.sender, _assetHash, _rating);
      reviews.push(newReview);

      emit NewReview(msg.sender, _text, _rating, _assetHash);
  }

  function get(uint _index) external view returns(uint id, string memory text, uint rating, string memory assetHash, address author) {
      Review memory at_i = reviews[_index];
      return (at_i.id, at_i.text, at_i.rating, at_i.assetHash, at_i.author);
  }
}
