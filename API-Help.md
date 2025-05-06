To create test account:
============================================================
https://test.bitpay.com/authenticate/signup?personal

OR login with

elpis.bangalore@gmail.com
bitpay@123


============================================================
For create Transaction:
============================================================

const myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

const raw = JSON.stringify({
  "price": "2",
  "currency": "USD",
  "buyerEmail": "hardikmandankaa@gmail.com",
  "customOrderId": "20284",
  "notificationURL":"https://webhook.site/12d25089-5eae-4954-8f41-cfa39961a4db"
});

const requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow"
};

https://crypto-taxibooking-20030426091.asia-south1.run.app/api/getSupportedCoins


fetch("https://crypto-taxibooking-20030426091.asia-south1.run.app/api/createTransaction", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  
  
  
  
============================================================
For get supported coin list
============================================================
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://crypto-taxibooking-20030426091.asia-south1.run.app/api/getSupportedCoins", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
  
  
============================================================
For get tranasction by id
============================================================
const requestOptions = {
  method: "GET",
  redirect: "follow"
};

fetch("https://crypto-taxibooking-20030426091.asia-south1.run.app/api/getTransactionByIds?id=5HtEH4L8ic5TgNYXyFTsYU", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.error(error));



{
    "status": 201,
    "data": {
        "url": "https://test.bitpay.com/invoice?id=TAezhCRpFKbyMASCvS5cub",
        "status": "new",
        "price": 24.39,
        "currency": "USD",
        "usdAmount": 24.39,
        "currencyUsdExchangeRate": 1,
        "orderId": "10553",
        "invoiceTime": 1746436502276,
        "rateRefreshTime": 1746436502276,
        "expirationTime": 1746437402276,
        "currentTime": 1746436502376,
        "id": "TAezhCRpFKbyMASCvS5cub",
        "lowFeeDetected": false,
        "amountPaid": 0,
        "displayAmountPaid": "0",
        "exceptionStatus": false,
        "refundAddressRequestPending": false,
        "buyerProvidedInfo": {},
        "paymentSubtotals": {
            "BTC": 25806,
            "BCH": 6801800,
            "ETH": 13355000000000000,
            "USDC": 24390000
        },
        "paymentTotals": {
            "BTC": 25953,
            "BCH": 6801800,
            "ETH": 13355000000000000,
            "USDC": 24390000
        },
        "paymentDisplayTotals": {
            "BTC": "0.00025953",
            "BCH": "0.068018",
            "ETH": "0.013355",
            "USDC": "24.39"
        },
        "paymentDisplaySubTotals": {
            "BTC": "0.00025806",
            "BCH": "0.068018",
            "ETH": "0.013355",
            "USDC": "24.39"
        },
        "exchangeRates": {
            "BTC": {
                "USD": 94511.1
            },
            "BCH": {
                "USD": 358.5799999999999
            },
            "ETH": {
                "USD": 1826.31
            },
            "USDC": {
                "USD": 1
            }
        },
        "supportedTransactionCurrencies": {
            "BTC": {
                "enabled": true
            },
            "BCH": {
                "enabled": true
            },
            "ETH": {
                "enabled": true
            },
            "GUSD": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "PAX": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "BUSD": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDC": {
                "enabled": true
            },
            "XRP": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "DOGE": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "LTC": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "APE": {
                "enabled": false
            },
            "EUROC": {
                "enabled": false
            },
            "MATIC": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "MATIC_e": {
                "enabled": false
            },
            "ETH_m": {
                "enabled": false
            },
            "USDC_m": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "BUSD_m": {
                "enabled": false
            },
            "DAI_m": {
                "enabled": false
            },
            "WBTC_m": {
                "enabled": false
            },
            "SHIB_m": {
                "enabled": false
            },
            "USDT": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDT_m": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "PYUSD": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDCn_m": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "ETH_arb": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDC_arb": {
                "enabled": false
            },
            "USDTe_arb": {
                "enabled": false
            },
            "ETH_op": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDC_op": {
                "enabled": false
            },
            "USDTe_op": {
                "enabled": false
            },
            "ETH_base": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "USDC_base": {
                "enabled": false
            }
        },
        "supportedModules": {
            "lightning": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "coinbase": {
                "enabled": true
            },
            "swap": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            },
            "borrow": {
                "enabled": false,
                "reason": "restrictedByMerchantProfile"
            }
        },
        "minerFees": {
            "BTC": {
                "satoshisPerByte": 1,
                "totalFee": 147,
                "fiatAmount": 0.14,
                "displayTotalFee": "0.00000147"
            },
            "BCH": {
                "satoshisPerByte": 0,
                "totalFee": 0,
                "fiatAmount": 0
            },
            "ETH": {
                "satoshisPerByte": 0,
                "totalFee": 0,
                "fiatAmount": 0
            },
            "USDC": {
                "satoshisPerByte": 0,
                "totalFee": 0,
                "fiatAmount": 0
            }
        },
        "jsonPayProRequired": false,
        "universalCodes": {
            "paymentString": "https://link.test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub"
        },
        "merchantName": "taxi",
        "swapInfo": {},
        "borrowInfo": {},
        "paymentCodes": {
            "BTC": {
                "BIP72b": "bitcoin:?r=https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub",
                "BIP73": "https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub"
            },
            "BCH": {
                "BIP72b": "bitcoincash:?r=https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub",
                "BIP73": "https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub"
            },
            "ETH": {
                "EIP681": "ethereum:?r=https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub"
            },
            "USDC": {
                "EIP681b": "ethereum:?r=https://test.bitpay.com/i/TAezhCRpFKbyMASCvS5cub"
            }
        },
        "token": "7jyZ3AP4bhrMvGGQCeLeNgzpPNLgdvWktdEAhjX1iRFGJy9z2yBMGsBp5gYYZWhcMn"
    }
}
