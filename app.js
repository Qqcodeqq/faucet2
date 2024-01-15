const faucetABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"}],"name":"AddressRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"addr","type":"address"}],"name":"AddressWhitelisted","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"claimer","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"EtherClaimed","type":"event"},{"inputs":[],"name":"addFunds","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"addToWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_addresses","type":"address[]"}],"name":"addToWhitelistBatch","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeFromWhitelist","outputs":[],"stateMutability":"nonpayable","type":"function"}];
const faucetAddress = "0xb9FA2C546221A4B30B6a972AAC8c94B65041A7C4"; // Replace with your contract's address
let web3;
let accounts;

async function loadWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
  } else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
  } else {
    alert("No web3 provider detected. Please install MetaMask or use a web3-enabled browser.");
  }
}

async function loadAccounts() {
  accounts = await web3.eth.getAccounts();
  if (accounts.length > 0) {
    document.getElementById("account").innerText = `Account: ${accounts[0]}`;
    document.getElementById("getBalance").disabled = false;
    document.getElementById("claim").disabled = false;
  } else {
    document.getElementById("account").innerText = "Account: N/A";
    document.getElementById("getBalance").disabled = true;
    document.getElementById("claim").disabled = true;
  }
}

async function connectWallet() {
  try {
    await loadWeb3();
    loadAccounts();
  } catch (err) {
    console.error("User denied account access");
  }
}

async function getBalance() {
  const faucetContract = new web3.eth.Contract(faucetABI, faucetAddress);
  const balance = await faucetContract.methods.getBalance().call();
  document.getElementById("balance").innerText = `Balance: ${web3.utils.fromWei(balance, "ether")} ETH`;
}

async function claim() {
  const faucetContract = new web3.eth.Contract(faucetABI, faucetAddress);
  try {
    await faucetContract.methods.claim().send({ from: accounts[0] });
    document.getElementById("claimStatus").innerText = "Claim successful!";
  } catch (err) {
    document.getElementById("claimStatus").innerText = "Claim failed!";
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("getBalance").addEventListener("click", getBalance);
document.getElementById("claim").addEventListener("click", claim);
