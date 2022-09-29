import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { Contract, providers, utils } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../constant";
import { parseEther } from "ethers/lib/utils";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [TokenMinted, setTokenMinted] = useState("0");
  const [Loading, setLoading] = useState(false);

  const web3ModalRef = useRef();

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (error) {
      console.error(error);
    }
  };

  const publicMint = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const contract = await new Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.mint({
        value: utils.parseEther("0.01"),
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);

      window.alert("You have succesfuly Minted a wownft");
    } catch (error) {
      console.error(error);
    }
  };

  const getTokenMinted = async () => {
    try {
      const provider = await getProviderOrSigner();
      const contract = await new Contract(CONTRACT_ADDRESS, ABI, provider);
      const _tokenIds = await contract.tokenIds();

      setTokenMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const getProviderOrSigner = async (needSigner = false) => {
    // Connect to Metamask
    // Since we store `web3Modal` as a reference, we need to access the `current` value to get access to the underlying object
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    // If user is not connected to the Mumbai network, let them know and throw an error
    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 80001) {
      window.alert("Change the network to Mumbai");
      throw new Error("Change network to Mumbai");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "mumbai",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
      getTokenMinted();
      //The code below updates the number of nfts minted after every 5 seconds
      setInterval(async function () {
        await getTokenMinted();
      }, 5 * 1000);
    }
  }, [walletConnected]);

  const renderButtton = () => {
    // If wallet is not connected, return a button which allows them to connect their wallet
    if (!walletConnected) {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }

    // If we are currently waiting for something, return a loading button
    if (Loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    return (
      <button className={styles.button} onClick={publicMint}>
        Public Mint 🚀
      </button>
    );
  };

  return (
    <div>
      <Head>
        <title>WowNfts</title>
        <meta name="description" content="LW3Punks-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to WowNfts</h1>
          <div className={styles.description}>
            Its an NFT collection for everyone.
          </div>
          <div className={styles.description}>
            {TokenMinted}/10 have been minted
          </div>
          {renderButtton()}
        </div>
        <div>
          <img className={styles.image} src="./wow.jpg" />
        </div>
      </div>

      <footer className={styles.footer}>Made with &#10084; by Dev Itoro</footer>
    </div>
  );
}
