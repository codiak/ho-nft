import React, { useState } from "react";

import { Button, Form, Input, Rate } from "antd";

const WriteReview = ({
  rows,
  cols,
  limit,
  chainId,
  nftTokenAddress,
  nftTokenId,
}) => {
  const [content, setContent] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  /**
   * Review input values
   */
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(3);
  // This might actually be the collection hash? Assets seem to have simple ids
  const [assetHash, setAssetHash] = useState("0x46d15ccfc1375e658fd0d59c1be93ac5b7350b43");
  const [assetId, setAssetId] = useState("171");
  const [owned, setOwned] = useState(false);

  const setFormattedContent = React.useCallback(
    (text) => {
      setContent(text.slice(0, limit));
    },
    [limit, setContent]
  );

  const createReview = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true);
      console.log(
        "before submit create review: ",
        content,
        chainId,
        nftTokenAddress,
        nftTokenId
      );
      // await submitReview(chainId, nftTokenAddress, nftTokenId, content);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* <style>
        {require("../css/antd.min.css")}
      </style> */}
      {/* <link href="antd/dist/antd.css" rel="stylesheet" media="screen" /> */}
      <div style={{ padding: 20 }}>
        {/* <textarea
          rows={rows}
          cols={cols}
          placeholder={"My humble opionion of this NFT .."}
          onChange={(event) => setFormattedContent(event.target.value)}
          value={content}
        /> */}
        {/* <Form.Item label="Review">
          <Input
              onChange={e => {
                  setNewReview(e.target.value);
              }}
              placeholder={"What do you think about this NFT?"}
          />
        </Form.Item> */}
        <Form.Item label="Review">
            <Input.TextArea
              showCount
              maxLength={200}
              style={{ height: 120, resize: 'none' }}
              onChange={value => setNewReview(value)}
              placeholder="Write your review..."
            />
        </Form.Item>
        <Form.Item label="Rating">
            <Rate
                onChange={value => setRating(value)}
                value={rating}
            />
                {/* <Col span={4}>{"⭐".repeat(rating)}</Col> */}
        </Form.Item>
        <Form.Item label="Asset Hash">
            <Input onChange={value => setAssetHash(value)} value={assetHash} placeholder="0x123..." />
        </Form.Item>
        <Form.Item label="Asset Id">
            <Input
                onChange={value => setAssetId(value)}
                value={assetId}
                placeholder="123..."
            />
        </Form.Item>
        {/* <Form.Item label="Are you an owner?">
            <Checkbox onChange={value => setOwned(value)} checked={owned}>
                Checkbox
            </Checkbox>
        </Form.Item> */}
      </div>
      <div style={{ paddingLeft: 20, paddingRight: 80, paddingBottom: 15 }}>
        {/* <button
          disabled={content.length === 0 || isLoading}
          className="Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 dpXlkZ fzwDgL"
          onClick={(e) => createReview(e)}
        >
          Submit Review
        </button> */}
        <Button type="primary" shape="round" onClick={createReview}
          disabled={content.length === 0 || isLoading}>
          Submit Review
        </Button>
      </div>
    </>
  );
};

export default WriteReview;
