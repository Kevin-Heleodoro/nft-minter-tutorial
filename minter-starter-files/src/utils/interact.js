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
				address: '',
				status: `That didn't work: ${err.message}`,
			};
		}
	} else {
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
	}
};
