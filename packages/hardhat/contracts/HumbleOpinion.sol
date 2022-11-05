pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "hardhat/console.sol";

contract HumbleOpinion {
    struct Review {
        uint256 id;
        string text;
        bool ownerWhenReviewed;
        address author;
        string assetHash;
        string assetId;
        uint256 rating;
        uint256 chainId;
    }

    Review[] public reviews;
    uint256 public reviewCount;

    // Might be able to clean this out in the future
    event NewReview(
        address sender,
        string review,
        uint256 rating,
        string assetHash,
        string assetId,
        uint256 chainId
    );

    constructor() {
        // what should we do on deploy?
    }

    function create(
        string memory _text,
        bool _owned,
        string memory _assetHash,
        string memory _assetId,
        uint256 _rating,
        uint256 _chainId
    ) external {
        require(bytes(_text).length > 0, "Review text is empty");
        require(bytes(_assetHash).length > 0, "Asset hash is empty");
        require(msg.sender != address(0), "Author address does not exist");
        reviewCount = reviewCount + 1;
        Review memory newReview = Review(
            reviewCount,
            _text,
            _owned,
            msg.sender,
            _assetHash,
            _assetId,
            _rating,
            _chainId
        );
        reviews.push(newReview);

        emit NewReview(msg.sender, _text, _rating, _assetHash, _assetId, _chainId);
    }

    function get(uint256 _index)
        external
        view
        returns (
            uint256 id,
            address author,
            string memory text,
            uint256 rating,
            string memory assetHash,
            string memory assetId,
            uint256 chainId
        )
    {
        Review memory at_i = reviews[_index];
        return (at_i.id, at_i.author, at_i.text, at_i.rating, at_i.assetHash, at_i.assetId, at_i.chainId);
    }
}
