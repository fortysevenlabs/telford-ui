import { ethers } from 'ethers';
import { useState, useEffect } from 'react';

import './App.css';
// import FormInput from './FormInput.js';
// import { Chains, Tokens } from './chainDetails';
import ARB_CONTRACT_ABI from  "./ARB_CONTRACT_ABI.json";


function App() {
  /* contracts */
  // hardcoding is fine for MVP
  const ARB_CONTRACT_ADDRESS = "0x03EFaDa4c8f815a504b38D30eec543D16CbeDE1b";
  const BONDER_FEE = "0.002";
  const TX_FEE = "0.000001"; // temporary for estimation only, later calculate GAS_PRICE * GAS_LIMIT

  /* properties  */

  // metamask connection
  const [connectButtonText, setConnectButtonText] = useState("Connect Wallet");
  const [walletAddress, setWalletAddress] = useState(null);
  const [message, setMessage] = useState(null);

  // ethers.js
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  // const [contract, setContract] = useState(null);

  // telford
  const [token, setToken] = useState();
  const [fromChain, setFromChain] = useState();
  const [toChain, setToChain] = useState();
  const [bridgeAmount, setBridgeAmount] = useState();
  const [estimatedBridgeAmount, setEstimatedBridgeAmount] = useState(0);

  // MVP demo - show balance
  // const [arbitrumBalance, setArbitrumBalance] = useState();
  // const [optimismBalance, setOptimismBalance] = useState();

  /* metamask connection helper functions */

  async function connectWallet() {
    // console.log('Connecting to wallet....');

    if (window.ethereum) {
      // console.log('Metamask wallet exists...');

      try {
        // console.log('Getting accounts from metamask...')
        // todo: review await + then
        await window.ethereum.request({
          method: 'eth_requestAccounts',
        }).then(accounts => {
          setMessage({type: "success", data: "Wallet Connected"});      
          accountChangedHandler(accounts);
        });

      } catch (error) {
        // console.log('Error connecting...');
          setMessage({type: "error", data:`Error connecting: ${error.message}`});      
      }

    } else if (!window.ethereum) {
      // console.log('please install metamask...');
      setMessage({type: "error", data: "Please install Metamask!"});
    }
  }

  /* metamask events */

  window.ethereum.on('accountsChanged', accountChangedHandler);

  window.ethereum.on('chainChanged', chainChangedHandler);

  /* metamask event handlers */

  function accountChangedHandler(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      setConnectButtonText("Connect Wallet");
      setWalletAddress(null);
      setMessage({type: "error", data: "Please connect to Metamask"});
    } else if (accounts[0] !== walletAddress) {
      setWalletAddress(accounts[0]);
      setMessage({type: "success", data: "Wallet Changed"});
      updateEthers();
    }
  }

  function chainChangedHandler(chainId) {
    window.location.reload();
  }

  async function updateEthers() {
    // todo: review why does this not work? 
    // setProvider(new ethers.providers.Web3Provider(window.ethereum));
    // setSigner(provider.getSigner());

    const tempProvider = new ethers.providers.Web3Provider(window.ethereum);
    const tempSigner = tempProvider.getSigner();
    setProvider(tempProvider);
    setSigner(tempSigner);
  }

  // try later
  // provider won't be immediately available for setSigner
  // use useReducer to update both provider and signer 
  // useEffect(() => { 
  //   console.log("in use effect - wallet changed");
  //   setProvider(new ethers.providers.Web3Provider(window.ethereum));
  //   setSigner(provider.getSigner());
  // }, [walletAddress]);

  /* telford event handlers  */

  const handleSubmit = async (e) => {
    e.preventDefault();
      console.log("we are iini handleSubmit....");

    if (walletAddress == null) {
      // MetaMask is locked or the user has not connected any accounts
      setMessage({type: "error", data: "Please connect to Metamask"});      
    } else if ( isNaN(bridgeAmount) || bridgeAmount == null) {
      setMessage({type: "error", data: "Please enter amount"});      
    } else if ( bridgeAmount < 0.003 ) {
      setMessage({type: "error", data: "Minimum amount is 0.003, please update amount"});      
    } else {
      // todo: is this the right place for contract intialization?
      // - with this approach, contract initialization will happen on every request 
      // - is it better to do that here or updateEthers()?
      const arbitrumSourceContract = new ethers.Contract(ARB_CONTRACT_ADDRESS, ARB_CONTRACT_ABI, signer);
      const arbitrumSourceContractWithSigner = arbitrumSourceContract.connect(signer);
      const overrides = { value: ethers.utils.parseEther(estimatedBridgeAmount.toString()) };

      arbitrumSourceContractWithSigner.bridge(overrides)
        .then(data => setMessage( {type:"success", data: `Bridge transaction initiated: ${shortAddress(data.hash)}`} ))
        .catch((err) => {
          console.log(`encountered error: ${err}`);
          setMessage( {type: "error", data: "User rejected the transaction"});
        })
    }
  }

  function handleSelectorChange(e) {
    e.preventDefault();
    if (e.target.name === "fromChain") {
      setFromChain(e.target.value);
    } else if (e.target.name === "toChain") {
      setToChain(e.target.value);
    } else if (e.target.name === "token") {
      setToken(e.target.value);
    }
  }

  function handleBridgeAmountChange(e) {
    e.preventDefault();
    setBridgeAmount(e.target.value);
  }

  useEffect(()=>{
    // not working when you backspace delete the bridgeAmount
    if (isNaN(bridgeAmount) || bridgeAmount == null) {
      setEstimatedBridgeAmount();
    } else if (bridgeAmount) {
      setEstimatedBridgeAmount(bridgeAmount - BONDER_FEE - TX_FEE);
    }
  }, [bridgeAmount]);

  function shortAddress(address) {
    if (address && address.length > 5) {
      var subStr1 = address.substr(0, 4)
      var subStr2 = address.substr(address.length - 4, 4)
      return subStr1 + '...' + subStr2
    }
    return ''
  }

  // async function getUserChainBalance(address) {
  //   const network = 'rinkeby' // use rinkeby testnet
  //   const provider = ethers.getDefaultProvider(network)

  //   provider.getBalance(address).then((balance) => {
  //     const balanceInEth = ethers.utils.formatEther(balance)
  //     console.log(`balance: ${balanceInEth} ETH`)
  //   })
  // }

  // const getGas = async (e) => {
    // web3s
    // const latestBlock : any = await web3.eth.getBlock('latest');
    // const gasLimit = latestBlock.gasLimit;
    // etherjs
    // const gasPrice = await provider.getFeeData().maxFeePerGas.mul(gasLimit);
    // const transactionFee = gasPrice * gasLimit;
  // }`
  
  return (

    //  Lot of redundant code, should be componentized

    <div className="App">
      
      <div className="header">
        <div className="Wallet">
            <button className="walletButton" onClick={connectWallet}>
              {walletAddress == null ? connectButtonText : shortAddress(walletAddress) }
            </button>
        </div>
      </div>

      <div className="message">
          {message && message.data}
      </div>

      {/* body cannot be a child of div */}
      <div className="body">
        <div className="form">
          <form onSubmit={handleSubmit}>
            {/* <FormInput refer={tokenRef} placeholder="Token" />
            <FormInput refer={fromChainRef} placeholder="From" />
            <FormInput refer={toChainRef} placeholder="To (estimated)" /> */}

            <span>
              {/* <label>
                Token:  */}
                  <select name="token" value={token} onChange={handleSelectorChange}>
                    <option key="1" value="eth"> ETH </option>
                    <option key="2" value="usdc" disabled> USDC </option>
                    <option key="3" value="dai" disabled> DAI </option>
                  </select>
              {/* </label> */}
              
            </span>

            <span>
              {/* <label>
                From:  */}
                  <select name="fromChain" value={fromChain} onChange={handleSelectorChange}>
                    {/* { ["mainnet", "arbitrum", "optimism"].forEach((element) => { 
                    <option key={element} value={element}> {element} </option> 
                    })} */}
                    <option key="1" value="mainnet" disabled> Mainnet </option>
                    <option key="2" value="arbitrum"> Arbitrum </option>
                    <option key="3" value="optimism" disabled> Optimism </option>
                  </select>
              {/* </label> */}
              {/* input validation - number, balancez  */}
            <input placeholder="amount" onChange={handleBridgeAmountChange} />
            {/* <input placeholder="Arbitrum Balance" value={arbitrumBalance} disabled /> */}
            </span>
                  
            <span>
            {/* <label>
              To (estimated):  */}
                <select name="toChain" value={toChain} onChange={handleSelectorChange}>
                  <option key="1" value="mainnet" disabled> Mainnet </option>
                  <option key="2" value="arbitrum" disabled> Arbitrum </option>
                  <option key="3" value="optimism"> Optimism </option>
                </select>
            {/* </label>   */}
            {/* <FormInput placeholder="Amount" disabled={true} /> */}
            <input placeholder="estimated amount" value={estimatedBridgeAmount} disabled />
            {/* <input placeholder="Optimism Balance" value={optimismBalance} disabled /> */}
            </span>


            {/* show estimated gas before submission  */}
            {/* info section for gas */}
            <span>
              <button className="sendButton"> Send </button>
            </span>
          </form>

        </div>
    </div>
  </div>  
    
  );
}

export default App;
