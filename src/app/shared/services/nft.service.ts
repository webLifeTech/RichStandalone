import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private web3: Web3 | null = null;
  private contract: any;
  private contractAddress = '0xba5084D99F755b7A2F0A7e6D196e0e60156043CE'; // Replace with your contract address
  abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }, { "indexed": false, "internalType": "string", "name": "newHashes", "type": "string" }], "name": "IPFSHashesUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }], "name": "NFTCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "NFTPriceUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }], "name": "NFTPurchased", "type": "event" }, { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string[]", "name": "initialHashes", "type": "string[]" }], "name": "createNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "nftId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "isBuyer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nftCounter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "nfts", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }], "name": "purchaseNFT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "uniqIdToNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "string", "name": "newHashes", "type": "string" }], "name": "updateIPFSHashes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "updateNFTPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }], "name": "viewNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdrawFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]; // Replace with your contract ABI

  constructor() { }

  // Connect to MetaMask
  async connectWallet(): Promise<string | null> {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3((window as any).ethereum);
        const accounts = await this.web3.eth.getAccounts();
        this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);
        console.log("this.contract >>>>>", this.contract);
        console.log("accounts >>>>>", accounts);
        return accounts[0];
      } catch (error) {
        console.error('User denied account access:', error);
        throw error;
      }
    } else {
      alert('MetaMask is not installed. Please install MetaMask to use this feature.');
      return null;
    }
  }

  // Purchase NFT
  async purchaseNFT(uniqId: string): Promise<void> {
    if (!this.web3 || !this.contract) {
      throw new Error('Web3 is not initialized. Please connect your wallet first.');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const buyer = accounts[0];

      const priceInEth = "0.0001";

      // Convert price from ETH to Wei
      const priceInWei = this.web3.utils.toWei(priceInEth, 'ether');
      console.log("uniqId", uniqId);
      console.log("buyer", buyer);
      console.log("priceInWei", priceInWei);

      // Call the purchaseNFT function
      await this.contract.methods.purchaseNFT(uniqId).send({
        from: buyer,
        value: priceInWei,
      });

      console.log("uniqId", uniqId);
      const nftUsers = localStorage.getItem('purchasedNFTUser') ? JSON.parse(localStorage.getItem('purchasedNFTUser') || '[]') : [];
      nftUsers.push(uniqId);
      localStorage.setItem('purchasedNFTUser', JSON.stringify(nftUsers));
      alert(`NFT with Unique ID: ${uniqId} purchased successfully!`);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      throw error;
    }
  }

  // // View NFT
  async viewNFT(uniqId: string): Promise<any> {
    if (!this.web3 || !this.contract) {
      throw new Error('Web3 is not initialized. Please connect your wallet first.');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const userAddress = accounts[0];
      const nftData = await this.contract.methods.viewNFT(uniqId).call({ from: userAddress });

      return nftData;
    } catch (error) {
      console.error('Error viewing NFT:', error);
      throw error;
    }
  }


  checkNFTPurchased(tableData: any) {
    const nftUsers = localStorage.getItem('purchasedNFTUser') ? JSON.parse(localStorage.getItem('purchasedNFTUser') || '[]') : [];
    for (let i in tableData) {
      if (nftUsers.indexOf(tableData[i].kyc_id) != -1) {
        tableData[i].isPurchased = true
      }
    }
    return tableData;
  }
}
