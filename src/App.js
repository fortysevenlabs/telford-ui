import './App.css';
import { useState } from 'react';

function App() {

  /* properties */
  // default to empty wallet address
  const [walletAddress, setWalletAddress] = useState("");

  /* helper functions */

  async function connectWallet() {
    console.log('Connecting to wallet....')

    if (window.ethereum) {
      console.log('Metamask wallet exists...')

      try {
        console.log('Getting accounts from metamask...')
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });
        console.log(accounts);
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.log('Error connecting...')
      }

    } else {
      console.log('please install metamask wallet...')
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        Telord

        <button onClick={connectWallet}>
          Connect Wallet
        </button>

        <h3> Wallet Addres: {walletAddress} </h3>

      </header>
    </div>
  );
}

export default App;
