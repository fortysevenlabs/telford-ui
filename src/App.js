import './App.css';
import FormInput from './FormInput.js';

import { ethers } from 'ethers';
import { useRef, useState } from 'react';

function App() {

  /* properties */
  // metamask connection
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // ethers.js
  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);

  // telford
  // use enums to support multiple tokens and chains
  const tokenRef = useRef("ETH");
  const fromChainRef = useRef("Arbitrum");
  const toChainRef = useRef("Optimism");

  /* helper functions */

  async function connectWallet() {
    console.log('Connecting to wallet....');

    if (window.ethereum) {
      console.log('Metamask wallet exists...');

      try {
        console.log('Getting accounts from metamask...')
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        }).then(accounts => {
          console.log(accounts);
          setConnectButtonText("Connected to Wallet");
          accountChangedHandler(accounts);
        });

      } catch (error) {
        console.log('Error connecting...');
        setErrorMessage(`Error connecting: ${error.message}`);
      }

    } else if (!window.ethereum) {
      console.log('please install metamask...');
      setErrorMessage("Please install Metamask!");
    }
  }

  async function updateEthers() {
    console.log("updateEthers trigerred....");

    // not working, review later
    // setProvider(new ethers.providers.Web3Provider(window.ethereum));
    // setSigner(tempSigner);

    // review the right place to set provider and signer later
    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempSigner = tempProvider.getSigner();
  }

  async function accountChangedHandler(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== walletAddress) {
      setWalletAddress(accounts[0]);
      updateEthers();
      // Do any other work!
    }
  }

  async function chainChangedHandler(chainId) {
    console.log("changed chain.. reloading..");
    window.location.reload();
    console.log("reloaded...")
  }

  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  // when no account is connected
  // - it should go back to "connect wallet"
  // - and the wallet address: should be empty

  // need to write functions consistently across this file
  const handleSubmit = (e) => {
    e.preventDefault();
    // contract.bridge();
  }

  return (
    <div className="App">
      <header className="App-header">
        Telord

        <button onClick={connectWallet}>
          {connectButtonText}
        </button>

        Wallet Address: {walletAddress}

        {errorMessage}

      </header>


      <div className="form">
        <form onSubmit={handleSubmit}>
          <FormInput refer={tokenRef} placeholder="Token" />
          <FormInput refer={fromChainRef} placeholder="From" />
          <FormInput refer={toChainRef} placeholder="To (estimated)" />
          {/* Info section - gas */}
          <button> Send </button>

        </form>

      </div>
    </div>
  );
}

export default App;
