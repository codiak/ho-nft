import {
    Button,
    Card,
    Checkbox,
    Col,
    DatePicker,
    Divider,
    Form,
    Input,
    Progress,
    Row,
    Slider,
    Spin,
    Switch,
} from "antd";
import React, { useState } from "react";
import { utils } from "ethers";
import { SyncOutlined } from "@ant-design/icons";

import { Address, Balance, Events } from "../components";

export default function ReviewForm({
    purpose,
    address,
    mainnetProvider,
    localProvider,
    yourLocalBalance,
    price,
    tx,
    readContracts,
    writeContracts,
}) {
    const [newReview, setNewReview] = useState("");
    const [rating, setRating] = useState(3);
    // This might actually be the collection hash? Assets seem to have simple ids
    const [assetHash, setAssetHash] = useState("0x46d15ccfc1375e658fd0d59c1be93ac5b7350b43");
    const [owned, setOwned] = useState(false);

    return (
        <div>
            {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
            <div style={{ border: "1px solid #cccccc", padding: 16, width: 400, margin: "auto", marginTop: 64 }}>
                <h2>Manual Review Form:</h2>
                <h4>purpose: {purpose}</h4>
                <Divider />
                <div style={{ margin: 8 }}>
                    <Form.Item label="Review">
                        <Input
                            onChange={e => {
                                setNewReview(e.target.value);
                            }}
                            placeholder={"What do you think about this NFT?"}
                        />
                    </Form.Item>
                    <Form.Item label="Rating">
                        <Row>
                            <Col span={12}>
                                <Slider
                                    min={0}
                                    max={5}
                                    onChange={value => {
                                        setRating(value);
                                    }}
                                    value={rating}
                                />
                            </Col>
                            <Col span={4}>{rating}</Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Asset Hash">
                        <Input
                            onChange={value => {
                                setAssetHash(value);
                            }}
                            value={assetHash}
                        />
                    </Form.Item>
                    <Form.Item label="Are you an owner?">
                        <Checkbox onChange={value => setOwned(value)} value={owned}>
                            Checkbox
                        </Checkbox>
                    </Form.Item>

                    <Button
                        style={{ marginTop: 8 }}
                        onClick={async () => {
                            /* look how you call setPurpose on your contract: */
                            /* notice how you pass a call back for tx updates too */
                            // string memory _text, bool _owned, string memory _assetHash, uint rating
                            const createTx = writeContracts.HumbleOpinion.create(newReview, owned, assetHash, rating);
                            const result = tx(createTx, update => {
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
                            console.log("awaiting metamask/web3 confirm result...", result);
                            console.log(await result);
                        }}
                    >
                        Post Review!
                    </Button>
                </div>
                <Divider />
                Your Address:
                <Address address={address} ensProvider={mainnetProvider} fontSize={16} />
                <Divider />
                ENS Address Example:
                <Address
                    address="0x34aA3F359A9D614239015126635CE7732c18fDF3" /* this will show as austingriffith.eth */
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />
                <Divider />
                {/* use utils.formatEther to display a BigNumber: */}
                <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
                <div>OR</div>
                <Balance address={address} provider={localProvider} price={price} />
                <Divider />
                <div>🐳 Example Whale Balance:</div>
                <Balance balance={utils.parseEther("1000")} provider={localProvider} price={price} />
                <Divider />
                {/* use utils.formatEther to display a BigNumber: */}
                <h2>Your Balance: {yourLocalBalance ? utils.formatEther(yourLocalBalance) : "..."}</h2>
                <Divider />
                Your Contract Address:
                <Address
                    address={readContracts && readContracts.HumbleOpinion ? readContracts.HumbleOpinion.address : null}
                    ensProvider={mainnetProvider}
                    fontSize={16}
                />
                <Divider />
                <div style={{ margin: 8 }}>
                    <Button
                        onClick={() => {
                            /* look how you call setPurpose on your contract: */
                            tx(writeContracts.HumbleOpinion.setPurpose("🍻 Cheers"));
                        }}
                    >
                        Set Purpose to &quot;🍻 Cheers&quot;
                    </Button>
                </div>
                <div style={{ margin: 8 }}>
                    <Button
                        onClick={() => {
                            /*
              you can also just craft a transaction and send it to the tx() transactor
              here we are sending value straight to the contract's address:
            */
                            tx({
                                to: writeContracts.HumbleOpinion.address,
                                value: utils.parseEther("0.001"),
                            });
                            /* this should throw an error about "no fallback nor receive function" until you add it */
                        }}
                    >
                        Send Value
                    </Button>
                </div>
                <div style={{ margin: 8 }}>
                    <Button
                        onClick={() => {
                            /* look how we call setPurpose AND send some value along */
                            tx(
                                writeContracts.HumbleOpinion.setPurpose("💵 Paying for this one!", {
                                    value: utils.parseEther("0.001"),
                                }),
                            );
                            /* this will fail until you make the setPurpose function payable */
                        }}
                    >
                        Set Purpose With Value
                    </Button>
                </div>
                <div style={{ margin: 8 }}>
                    <Button
                        onClick={() => {
                            /* you can also just craft a transaction and send it to the tx() transactor */
                            tx({
                                to: writeContracts.HumbleOpinion.address,
                                value: utils.parseEther("0.001"),
                                data: writeContracts.HumbleOpinion.interface.encodeFunctionData("setPurpose(string)", [
                                    "🤓 Whoa so 1337!",
                                ]),
                            });
                            /* this should throw an error about "no fallback nor receive function" until you add it */
                        }}
                    >
                        Another Example
                    </Button>
                </div>
            </div>

            {/*
        📑 Maybe display a list of events?
          (uncomment the event and emit line in HumbleOpinion.sol! )
      */}
            <Events
                contracts={readContracts}
                contractName="HumbleOpinion"
                eventName="NewReview"
                localProvider={localProvider}
                mainnetProvider={mainnetProvider}
                startBlock={1}
            />

            <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 256 }}>
                <Card>
                    Check out all the{" "}
                    <a
                        href="https://github.com/austintgriffith/scaffold-eth/tree/master/packages/react-app/src/components"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        📦 components
                    </a>
                </Card>

                <Card style={{ marginTop: 32 }}>
                    <div>
                        There are tons of generic components included from{" "}
                        <a href="https://ant.design/components/overview/" target="_blank" rel="noopener noreferrer">
                            🐜 ant.design
                        </a>{" "}
                        too!
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <Button type="primary">Buttons</Button>
                    </div>

                    <div style={{ marginTop: 8 }}>
                        <SyncOutlined spin /> Icons
                    </div>

                    <div style={{ marginTop: 8 }}>
                        Date Pickers?
                        <div style={{ marginTop: 2 }}>
                            <DatePicker onChange={() => {}} />
                        </div>
                    </div>

                    <div style={{ marginTop: 32 }}>
                        <Slider range defaultValue={[20, 50]} onChange={() => {}} />
                    </div>

                    <div style={{ marginTop: 32 }}>
                        <Switch defaultChecked onChange={() => {}} />
                    </div>

                    <div style={{ marginTop: 32 }}>
                        <Progress percent={50} status="active" />
                    </div>

                    <div style={{ marginTop: 32 }}>
                        <Spin />
                    </div>
                </Card>
            </div>
        </div>
    );
}
