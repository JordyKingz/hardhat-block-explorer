## Introduction

Welcome to the local block explorer! A Etherscan clone for local development. This app allows you to easily interact with your local blockchain.

### Usage
Make sure MetaMask is installed.

Clone this repository and navigate to the project directory. 

Install the dependencies by running ```npm install``` or ```yarn install```.

Start the development server by running ```npm run dev``` or ```yarn dev```.

Open http://localhost:5173 in your browser to access the app.

Run your local blockchain and make sure it's running on port 8545. 

Add your smart contract abis in the ```config/abis/``` 
folder and name them according to the contract address. 

For example, if your contract address is ```0x0000000000000000000000000000000000000000```,
name the abi file ```0x0000000000000000000000000000000000000000.json```.

You can now interact with your local blockchain in the same way you would with Etherscan.io


### Features

    View blocks, transactions, and contract details
    Search for addresses, blocks, and transactions

### Development
The project is still in development. Features are being added and bugs are being fixed.

Features to be implemented:

    View events emitted by smart contracts
    View contract source code
    Deploy and interact with smart contracts

### Contributions

This project is open source and contributions are welcome! If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

### License

This project is licensed under the MIT License. See the LICENSE file for details.