import React, { useCallback, useEffect, useState } from "react";
import {
  useContractLoader,
  // useEthersAdaptorFromProviderOrSigners
  // useBurnerSigner,
  useGasPrice,
  useUserProviderAndSigner
  // useEthersContext
} from "eth-hooks";
import useStaticJsonRPC from "../hooks/useStaticJsonRPC.js";
import { Button, Form, Input, Rate } from "antd";
// todo: reference fresh deployedContracts
// import deployedContracts from "../../../hardhat/contracts/hardhat_contracts.json";
import HARDCODED_CONTRACT_CONFIG from "./contract_config.js";
import Web3ModalSetup from "./Web3ModalSetup.js";
import Transactor from "./Transactor.js";


const web3Modal = Web3ModalSetup();

const USE_BURNER_WALLET = true;

const WriteReview = ({
  rows,
  cols,
  limit,
  chainId,
  nftTokenAddress,
  nftTokenId,
  targetNetwork,
}) => {
  // Write contracts

  const [injectedProvider, setInjectedProvider] = useState();

  // configure process.env.REACT_APP_PROVIDER for local???
  const localProvider = useStaticJsonRPC([ targetNetwork.rpcUrl ]);
  const localChainId = localProvider && localProvider._network && localProvider._network.chainId;
  // const userProviderAndSigner = useEthersAdaptorFromProviderOrSigners(injectedProvider, localProvider, USE_BURNER_WALLET);
  // const userSigner = userProviderAndSigner.signer;
  /** @todo: support non-burner signer */
  // const userSigner = useBurnerSigner(localProvider);
  const userProviderAndSigner = useUserProviderAndSigner(injectedProvider, localProvider, USE_BURNER_WALLET);
  const userSigner = userProviderAndSigner.userSigner;
  // const userSigner = useEthersAdaptorFromProviderOrSigners(injectedProvider);

  // const contractConfig = { deployedContracts: deployedContracts || {}, externalContracts: externalContracts || {} };
  const contractConfig = HARDCODED_CONTRACT_CONFIG;

  // const readContracts = useContractLoader(localProvider, contractConfig);
  // If you want to make 🔐 write transactions to your contracts, use the userSigner:
  const writeContracts = useContractLoader(userSigner, contractConfig, localChainId);



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
  const gasPrice = useGasPrice(targetNetwork, "fast", 30000);

  const tx = Transactor(userSigner, gasPrice);

  const loadWeb3Modal = useCallback(async () => {
      console.log("LoadWeb3Modal running callback...");
      const provider = await web3Modal.connect();
      setInjectedProvider(new ethers.providers.Web3Provider(provider));

      provider.on("chainChanged", chainId => {
          console.log(`chain changed to ${chainId}! updating providers`);
          setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      provider.on("accountsChanged", () => {
          console.log(`account changed!`);
          setInjectedProvider(new ethers.providers.Web3Provider(provider));
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
          console.log(code, reason);
          logoutOfWeb3Modal();
      });
      // eslint-disable-next-line
  }, [setInjectedProvider]);

  useEffect(() => {
    if (web3Modal.cachedProvider) {
        loadWeb3Modal();
    }
  }, [loadWeb3Modal]);

  useEffect(() => {
    async function getAddress() {
        if (userSigner) {
            const newAddress = await userSigner.getAddress();
            setAddress(newAddress);
        }
    }
    getAddress();
}, [userSigner]);

  const setFormattedContent = React.useCallback(
    (text) => {
      setContent(text.slice(0, limit));
    },
    [limit, setContent]
  );

  const postToContract = async () => {
    console.log("postToContract writeContracts -->", writeContracts);
    const createTx = writeContracts.HumbleOpinion.create(
      newReview,
      owned,
      assetHash,
      assetId,
      rating,
      chainId,
    );
    console.log("awaiting metamask/web3 confirm result...");
    const result = await tx(createTx, update => {
        console.log("📡 Transaction Update:", update);
        if (update && (update.status === "confirmed" || update.status === 1)) {
            console.log(" 🍾 Transaction " + update.hash + " finished!");
            console.log(
                " ⛽️ " +
                    update.gasUsed +
                    "/" +
                    (update.gasLimit || update.gas) +
                    " @ " +
                    parseFloat(update.gasPrice) / 1000000000 +
                    " gwei",
            );
        }
    });
    console.log(result);
  };

  const createReview = async () => {
    try {
      // e.preventDefault();
      setIsLoading(true);
      console.log(
        "before submit create review: ",
        content,
        chainId,
        nftTokenAddress,
        nftTokenId
      );
      // await submitReview(chainId, nftTokenAddress, nftTokenId, content);
      await postToContract();
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
          disabled={newReview.length === 0 || isLoading}>
          Submit Review
        </Button>
      </div>
    </>
  );
};

export default WriteReview;
