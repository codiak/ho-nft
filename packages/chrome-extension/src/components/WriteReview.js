import React from "react";

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
      <div style={{ padding: 20 }}>
        <textarea
          rows={rows}
          cols={cols}
          placeholder={"My humble opionion of this NFT .."}
          onChange={(event) => setFormattedContent(event.target.value)}
          value={content}
        />
        <p>
          {content.length}/{limit}
        </p>
      </div>
      <div style={{ paddingLeft: 20, paddingRight: 80, paddingBottom: 15 }}>
        <button
          disabled={content.length === 0 || isLoading}
          className="Blockreact__Block-sc-1xf18x6-0 Buttonreact__StyledButton-sc-glfma3-0 dpXlkZ fzwDgL"
          onClick={(e) => createReview(e)}
        >
          Submit Review
        </button>
      </div>
    </>
  );
};

export default WriteReview;
