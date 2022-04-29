import { pinJSONtoIPFS } from './pinata';

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const contractABI = require('../contract-abi.json');
const contractAddress = '0x4C4a07F737Bf57F6632B6CAB089B78f62385aCaE';
const { createAlchemyWeb3 } = require('@alch/alchemy-web3');
const web3 = createAlchemyWeb3(alchemyKey);

export const mintNFT = async (url, name, description) => {
	// error handling
	if (url.trim() === '' || name.trim() === '' || description.trim() === '') {
		return {
			success: false,
			status: `❗Fill all fields before minting❗`,
		};
	}

	// create metadata
	const metadata = {};
	metadata.name = name;
	metadata.image = url;
	metadata.description = description;

	// pinata call
	const pinataResponse = await pinJSONtoIPFS(metadata);
	if (!pinataResponse.success) {
		return {
			success: false,
			status: `Whoops! That didn't work 😢. Issue with tokenURI`,
		};
	}

	const tokenURI = pinataResponse.pinataUrl;

	// load smart contract
	window.contract = await new web3.eth.Contract(contractABI, contractAddress);

	// set up your Eth transaction
	const transactionParameters = {
		to: contractAddress,
		from: window.ethereum.selectedAddress,
		data: window.contract.methods
			.mintNFT(window.ethereum.selectedAddress, tokenURI)
			.encodeABI(),
	};

	// sign transaction via metamask
	try {
		const txHash = await window.ethereum.request({
			method: 'eth_sendTransaction',
			params: [transactionParameters],
		});

		return {
			success: true,
			status: `Success! Check it out: https://ropsten.etherscan.io/tx/${txHash}`,
		};
	} catch (err) {
		return {
			success: false,
			status: `Fail! ${err.message}`,
		};
	}
};

export const connectWallet = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: 'eth_requestAccounts',
			});
			const obj = {
				status: '👆🏽 Write a message.',
				address: addressArray[0],
			};

			return obj;
		} catch (err) {
			return {
				status: `That didn't work: ${err.message}`,
				address: '',
			};
		}
	} else {
		installMetamask();
	}
};

export const getCurrentWalletConnected = async () => {
	if (window.ethereum) {
		try {
			const addressArray = await window.ethereum.request({
				method: 'eth_accounts',
			});

			if (addressArray.length > 0) {
				return {
					status: '👆🏽 Write a message.',
					address: addressArray[0],
				};
			} else {
				return {
					status: 'Connect to Metamask 🦊',
					address: '',
				};
			}
		} catch (err) {
			return {
				status: `That didn't work: ${err.message}`,
				address: '',
			};
		}
	} else {
		installMetamask();
	}
};

export const installMetamask = () => {
	return {
		address: '',
		status: (
			<span>
				<p>
					{' '}
					🦊{' '}
					<a
						target='_blank'
						rel='noreferrer'
						href={`https://metamask.io/download.html`}
					>
						You're going to need to install Metamask ...
					</a>
				</p>
			</span>
		),
	};
};
