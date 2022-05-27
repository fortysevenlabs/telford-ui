import './App.css';

function App() {

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

        <h3> Wallet Addres: 0x002adaxxxx345c </h3>

      </header>
    </div>
  );
}

export default App;
