import { Injectable } from '@angular/core';
import Web3 from 'web3';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from './global.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class NftService {
  baseUrl1 = environment.apiUrl1;
  private web3: Web3 | null = null;
  private contract: any;
  private contractAddress = '0xba5084D99F755b7A2F0A7e6D196e0e60156043CE'; // Replace with your contract address
  abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }, { "indexed": false, "internalType": "string", "name": "newHashes", "type": "string" }], "name": "IPFSHashesUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }], "name": "NFTCreated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "string", "name": "uniqId", "type": "string" }, { "indexed": false, "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "NFTPriceUpdated", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "id", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" }], "name": "NFTPurchased", "type": "event" }, { "inputs": [], "name": "admin", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "uint256", "name": "price", "type": "uint256" }, { "internalType": "string[]", "name": "initialHashes", "type": "string[]" }], "name": "createNFT", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "nftId", "type": "uint256" }, { "internalType": "address", "name": "user", "type": "address" }], "name": "isBuyer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "nftCounter", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "nfts", "outputs": [{ "internalType": "uint256", "name": "id", "type": "uint256" }, { "internalType": "uint256", "name": "price", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }], "name": "purchaseNFT", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "", "type": "string" }], "name": "uniqIdToNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "string", "name": "newHashes", "type": "string" }], "name": "updateIPFSHashes", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }, { "internalType": "uint256", "name": "newPrice", "type": "uint256" }], "name": "updateNFTPrice", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "uniqId", "type": "string" }], "name": "viewNFT", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "uint256", "name": "", "type": "uint256" }, { "internalType": "string[]", "name": "", "type": "string[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdrawFunds", "outputs": [], "stateMutability": "nonpayable", "type": "function" }]; // Replace with your contract ABI

  constructor(
    private http: HttpClient,
    private gs: GlobalService,
    private toast: ToastService,
  ) { }


  // Nft -> GetNftDocDetails
  public GetNftDocDetails(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Nft/GetNftDocDetails', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Nft -> InsertNftPaymentst
  public InsertNftPaymentst(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Nft/InsertNftPaymentst', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Nft -> StoreMetaMaskRequest
  public StoreMetaMaskRequest(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Nft/StoreMetaMaskRequest', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Nft -> StoreMetaMaskResponse
  public StoreMetaMaskResponse(data: any) {
    return this.http.post(this.baseUrl1 + 'TLHUB/Nft/StoreMetaMaskResponse', data).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  // Connect to MetaMask
  async connectWallet(recieverContractId?: any): Promise<string | null> {
    if ((window as any).ethereum) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        this.web3 = new Web3((window as any).ethereum);
        const accounts = await this.web3.eth.getAccounts();
        this.contract = new this.web3.eth.Contract(this.abi, recieverContractId); // this.contractAddress
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
  async purchaseNFT(item: any): Promise<void> {
    if (!this.web3 || !this.contract) {
      throw new Error('Web3 is not initialized. Please connect your wallet first.');
    }

    try {
      const accounts = await this.web3.eth.getAccounts();
      const buyer = accounts[0];
      const coinType = "ether";
      const priceInEth = item.price; // "0.0001"

      // Convert price from ETH to Wei
      const priceInWei = this.web3.utils.toWei(priceInEth, coinType);

      item.riskId = item.riskId.toString();
      console.log("buyer", buyer);
      console.log("priceInWei", priceInWei);
      console.log("uniqId", item.riskId);

      let body: any = {
        "userId": item.userId,
        "riskId": item.riskId,
        "riskType": item.documentType,
        "nftDocType": 0, // what is nftDocType ?
        "nftHash": item.nftHash,
        "requestData": JSON.stringify({
          uniqId: item.riskId,
          from: buyer,
          value: priceInWei,
          coin: coinType,
        }),
        "responseData": null,
        "createdBy": this.gs.loggedInUserInfo.userId
      }

      this.StoreMetaMaskRequest(body).subscribe((res: any) => { });

      // Call the purchaseNFT function
      let purchaseRes: any = await this.contract.methods.purchaseNFT(item.riskId).send({
        from: buyer,
        value: priceInWei,
      }).then((receipt: any) => {
        return receipt;
      }).catch((error: any) => {
        this.toast.errorToastr("Nft purchase Failed");
        if (error && error.receipt) {
          console.error('Revert error object:', error.receipt);
          return error.receipt;
        }
        return error;
      });;

      console.log("purchaseRes >>>>>>>", purchaseRes);


      body.requestData = null;
      // delete purchaseRes.events;
      // delete purchaseRes.logs;
      // delete purchaseRes.logsBloom;
      const resMdfyBody = {
        blockHash: purchaseRes.blockHash,
        blockNumber: purchaseRes.blockNumber.toString(),
        cumulativeGasUsed: purchaseRes.cumulativeGasUsed.toString(),
        effectiveGasPrice: purchaseRes.effectiveGasPrice.toString(),
        from: purchaseRes.from,
        gasUsed: purchaseRes.gasUsed.toString(),
        status: purchaseRes.status.toString(),
        to: purchaseRes.to,
        transactionHash: purchaseRes.transactionHash,
        transactionIndex: purchaseRes.transactionIndex.toString(),
        type: purchaseRes.type.toString(),
      }
      body.responseData = JSON.stringify(resMdfyBody);

      this.StoreMetaMaskResponse(body).subscribe((res: any) => { });

      if (resMdfyBody.status == "1n" || resMdfyBody.status == "1") {
        this.toast.successToastr(`NFT with Unique ID: ${item.riskId} purchased successfully!`)
        this.InsertNftPaymentst({
          "documentId": item.doc_Id,
          "nftDocType": 1,
          "nftHash": item.nftHash,
          "userId": item.userId, // which user id pass ?
          "riskId": item.riskId,
          "riskType": item.documentType,
          "transactionId": null,
          "transactionHash": resMdfyBody.transactionHash,
          "transactionType": resMdfyBody.type,
          "walletId": resMdfyBody.from,
          "currencyType": 1,
          "blockHash": resMdfyBody.blockHash,
          "metaMaskTransactionStatusCode": resMdfyBody.blockHash,
          "amount": item.price,
          "receiverContractId": item.recieverContractId,
          "status": null,
          "createdBy": this.gs.loggedInUserInfo.userId
        }).subscribe((res: any) => { });
      }

      // alert(`NFT with Unique ID: ${item.riskId} purchased successfully!`);
    } catch (error) {
      console.error('Error purchasing NFT: -->>', error);
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
