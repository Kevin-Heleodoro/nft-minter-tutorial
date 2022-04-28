require('dotenv').config();
const axios = require('axios');

console.log(process.env);

const { PINATA_KEY, PINATA_SECRET } = process.env;

export const pinJSONtoIPFS = async (JSONBody) => {
	const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

	return axios
		.post(url, JSONBody, {
			headers: {
				pinata_api_key: PINATA_KEY,
				pinata_secret_api_key: PINATA_SECRET,
			},
		})
		.then((res) => {
			return {
				success: true,
				pinataUrl: `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`,
			};
		})
		.catch((error) => {
			console.log(`Whoops: ${error}`);
			return {
				success: false,
				message: error.message,
			};
		});
};
