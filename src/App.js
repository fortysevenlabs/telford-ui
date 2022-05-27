import './App.css';
// import { ethers } from 'ethers';
import { useState } from 'react';

function App() {

  /* properties */
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // ethers properties
  // const [provider, setProvider] = useState(null);
  // const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);

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
    // const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    // const tempSigner = tempProvider.getSigner();
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

  return (
    <div className="App">
      <header className="App-header">
        Telord

        <button onClick={connectWallet}>
          {connectButtonText}
        </button>

        <h3> Wallet Addres: {walletAddress} </h3>

        {errorMessage}

      </header>
    </div>
  );
}

export default App;
