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

const installMetamask = () => {
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
