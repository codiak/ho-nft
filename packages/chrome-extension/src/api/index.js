const fetchGraphReviews = (chainId, address, id) => {
  const fetch = new Promise((resolve) => {
    const query = `
    {
      reviews(where: {chainId: ${chainId}, nftTokenAddress: "${address}", nftTokenId: ${id}}) {
        id
        chainId
        nftTokenAddress
        nftTokenId
        rating
        content
        createdAt
        user {
          id
          address
          username
          avatar
        }
      }`;
  });

  let review = Math.random() > 0.4 ? fetch : undefined;
  return review;
};

const fetchGReviews = async (chainId, address, id) => {
  const review = await fetch(
    `https://api.thegraph.com/subgraphs/name/ameer-clara/honft-test`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: `{
                        newReviews(assetHash: "${address}", assetId: ${id}) {
                          id
                          sender
                          assetHash
                          assetId
                          review
                          rating
                        }
                      }`,
      }),
    }
  );
  //   console.log("review", await review.json());

  return (await review.json())?.data?.newReviews;
};

export { fetchGReviews };
