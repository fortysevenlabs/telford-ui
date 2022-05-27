import './App.css';

function App() {

  async function connectWallet() {
    console.log("Connecting to wallet....")

    if (window.ethereum) {
      console.log("metamask wallet exists...")
    } else {
      console.log("please install metamask wallet...")
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
