import { ethers } from 'ethers';
import { useRef, useState } from 'react';

import './App.css';
import FormInput from './FormInput.js';
import { Chains, Tokens } from './chainDetails';
import ARB_CONTRACT_ABI from  "./ARB_CONTRACT_ABI.json";


function App() {
  /* contracts */
  // move to config file
  const ARB_CONTRACT_ADDRESS="0x03EFaDa4c8f815a504b38D30eec543D16CbeDE1b";

  /* properties  */

  // metamask connection
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // ethers.js
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);

  // telford
  // use enums to support multiple tokens and chains
  const [token, setToken] = useState();
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();

  /* metamask connection helper functions */

  async function connectWallet() {
    console.log('Connecting to wallet....');

    if (window.ethereum) {
      console.log('Metamask wallet exists...');

      try {
        console.log('Getting accounts from metamask...')
        // todo: await + then
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        }).then(accounts => {
          console.log(accounts);
          setConnectButtonText("Wallet Connected");
          accountChangedHandler(accounts);
          // getBalance and update that on the form selector
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

    // console.log(Chains);
    // console.log(Tokens);

    // todo: review why does this not work? 
    // setProvider(new ethers.providers.Web3Provider(window.ethereum));
    // setSigner(provider.getSigner());
    // curious - these are still null here but available in handleSubmit
    // console.log(provider);
    // console.log(signer);

    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempSigner = tempProvider.getSigner();
    setProvider(tempProvider);
    setSigner(tempSigner);
  }

  /* metamask event handlers */

  async function accountChangedHandler(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setConnectButtonText("Connect Wallet");
      setWalletAddress(null);
      setErrorMessage("Please connect to Metamask");
      console.log('Please connect to MetaMask.');
    } else if (accounts[0] !== walletAddress) {
      setWalletAddress(accounts[0]);
      updateEthers();
    }
  }

  async function chainChangedHandler(chainId) {
    window.location.reload();
  }

  /* metamask events */

  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  /* telford event handlers  */

  const handleSubmit = async (e) => {
    e.preventDefault();
    // todo: validations
    // source and destination are supported
    // bridgeAmount << balance
    // bridge + gas << balance

    console.log(token);
    console.log(fromChain);
    console.log(toChain); 
    
    // todo: is this the right place for contract intialization?
    // - with this approach, contract initialization will happen on every request 
    // - updateEthers() doesn't feel like a good place for contract
    console.log(signer);
    console.log(provider);
    const arbitrumSourceContract = new ethers.Contract(ARB_CONTRACT_ADDRESS, ARB_CONTRACT_ABI, signer);
    const arbitrumSourceContractWithSigner = arbitrumSourceContract.connect(signer);
    const overrides = { value: ethers.utils.parseEther("0.003").toString() };
    arbitrumSourceContractWithSigner.bridge(overrides)
      .then(data => setSuccessMessage(`Bridge transaction initiated: ${data.hash}`))
      .catch(err => setErrorMessage(err));
    // debugger;
  }

  const handleSelectorChange = async (e) => {
    // is this required? we are not submitting?
    e.preventDefault();
   
    if (e.target.name === "fromChain") {
      console.log("matched fromChain change")
      setFromChain(e.target.value);
    } else if (e.target.name === "toChain") {
      console.log("matched tochain change")
      setToChain(e.target.value);
    } else if (e.target.name === "token") {
      console.log("matched token change")
      setToken(e.target.value);
    }

  }

  return (

    <div className="App">
      
      <div className="header">
        <div className="Wallet">
            <button className="walletButton" onClick={connectWallet}>
              {walletAddress == null ? connectButtonText : walletAddress }
            </button>
        </div>
      </div>

      {/* body cannot be a child of div */}
      <div className="bridgeBody">
        <div className="form">
          <form onSubmit={handleSubmit}>
            {/* <FormInput refer={tokenRef} placeholder="Token" />
            <FormInput refer={fromChainRef} placeholder="From" />
            <FormInput refer={toChainRef} placeholder="To (estimated)" /> */}

            <span>
              <label>
                Token: 
                  <select name="token" value={token} onChange={handleSelectorChange}>
                    <option key="1" value="eth"> eth </option>
                    <option key="2" value="usdc"> usdc </option>
                    <option key="3" value="dai"> dai </option>
                  </select>
              </label>
            </span>

            <span>
              <label>
                From: 
                  <select name="fromChain" value={fromChain} onChange={handleSelectorChange}>
                    {/* { ["mainnet", "arbitrum", "optimism"].forEach((element) => { 
                    <option key={element} value={element}> {element} </option> 
                    })} */}
                    <option key="1" value="mainnet"> mainnet </option>
                    <option key="2" value="arbitrum"> arbitrum </option>
                    <option key="3" value="optimism"> optimism </option>
                  </select>
              </label>
            </span>
                  
            <span>
            <label>
              To (estimated): 
                <select name="toChain" value={toChain} onChange={handleSelectorChange}>
                  <option key="1" value="mainnet"> mainnet </option>
                  <option key="2" value="arbitrum"> arbitrum </option>
                  <option key="3" value="optimism"> optimism </option>
                </select>
            </label>  
            </span>

            {/* show estimated gas before submission  */}
            {/* info section for gas */}
            
            <button className="sendButton"> Send </button>
          </form>

          {/* error or success message, this can be lot cleaner  */}
          {errorMessage} 
          {successMessage}
        </div>
    </div>
  </div>  
    
  );
}

export default App;
