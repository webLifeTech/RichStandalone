import { Injectable } from '@angular/core';
import Web3 from 'web3';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  private web3: Web3 | null = null;
  private contract: any;
  private contractAddress = '0x372aB8bB444e513bD63c74547d00179fC3Fb432d'; // Replace with your contract address
  private abi = [
    // Paste your contract ABI here
  ];

  constructor() { }

  // Connect to MetaMask
  async connectWallet(): Promise<string | null> {
    if ((window as any).ethereum) {
      try {
        // Request account access
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3((window as any).ethereum);

        // Get user's wallet address
        const accounts = await this.web3.eth.getAccounts();
        this.contract = new this.web3.eth.Contract(this.abi, this.contractAddress);

        console.log("this.contract >>>>>", this.contract);


        return accounts[0]; // Return the connected wallet address
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
  async purchaseNFT(uniqId: string, priceInEth: string): Promise<void> {
    if (!this.web3 || !this.contract) {
      throw new Error('Web3 is not initialized. Please connect your wallet first.');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const buyer = accounts[0];

      // Convert price from ETH to Wei
      const priceInWei = this.web3.utils.toWei(priceInEth, 'ether');

      // Call the purchaseNFT function
      await this.contract.methods.purchaseNFT(uniqId).send({
        from: buyer,
        value: priceInWei,
      });

      alert(`NFT with Unique ID: ${uniqId} purchased successfully!`);
    } catch (error) {
      console.error('Error purchasing NFT:', error);
      throw error;
    }
  }

  // // View NFT
  // async viewNFT(uniqId: string): Promise<any> {
  //   if (!this.web3 || !this.contract) {
  //     throw new Error('Web3 is not initialized. Please connect your wallet first.');
  //   }

  //   try {
  //     const accounts = await this.web3.eth.getAccounts();
  //     const userAddress = accounts[0];

  //     console.log("this.contract >>>>>", this.contract);
  //     console.log("uniqId >>>>>", uniqId);

  //     // Call the viewNFT function from the contract
  //     return await this.contract.methods.viewNFT(uniqId).call({ from: userAddress });
  //   } catch (error) {
  //     console.error('Error viewing NFT:', error);
  //     throw error;
  //   }
  // }

  async viewNFT(uniqId: string): Promise<any> {
    if (!this.web3 || !this.contract) {
      throw new Error('Web3 is not initialized. Please connect your wallet first.');
    }

    try {
      console.log('Available Methods:', this.contract.methods); // Log all methods

      const accounts = await this.web3.eth.getAccounts();
      console.log("accounts >>>>>", accounts);

      const userAddress = accounts[0];

      // Call the viewNFT function
      return await this.contract.methods.viewNFT(uniqId).call({ from: userAddress });
    } catch (error) {
      console.error('Error viewing NFT:', error);
      throw error;
    }
  }
}
