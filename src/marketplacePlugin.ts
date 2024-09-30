import { Web3PluginBase, Receipt } from 'web3';
import { marketplaceContract } from './types';

export class Web3MarketplacePlugin extends Web3PluginBase {
	public pluginNamespace = 'marketplace';

	constructor() {
		super();
	}

	private getSender = async (): Promise<string> => {
		const accounts: string[] = await this._requestManager.send({ method: 'eth_accounts' });
		let sender;
		// check if there are any accounts within wallet provider, if not use the default account.
		if (accounts.length === 0) {
			sender = this.config.defaultAccount;
		} else {
			sender = accounts[0];
		}
		if (!sender) {
			throw new Error(
				"No account found, please connect to a wallet provider or set a default account - 'web3.config.defaultAccount = <your address>'",
			);
		}
		return sender;
	};

	/**
	 * Places an item for sale on the marketplace using Web3.js.
	 *
	 * @param {marketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} nftContract - The address of the NFT contract.
	 * @param {string} tokenId - The ID of the token in the NFT contract.
	 * @param {string} price - The listing price in wei as a string.
	 * @param {string} deadline - The listing deadline as a UNIX timestamp in seconds, or "0" if no deadline.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async listItem(
		contract: marketplaceContract,
		nftContract: string,
		tokenId: string,
		price: string,
		deadline: string,
	): Promise<Receipt> {
		const sender = await this.getSender();

		const receipt = await contract.methods.listItem(nftContract, tokenId, price, deadline).send({
			from: sender,
		});

		return receipt;
	}
	/**
	 * Places multiple items for sale on the marketplace using Web3.js.
	 *
	 * @param {marketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string[]} nftContracts - Array of NFT contract addresses.
	 * @param {string[]} tokenIds - Array of token IDs in the NFT contracts.
	 * @param {string[]} amounts - Array of token amounts as strings.
	 * @param {string[]} prices - Array of listing prices in wei as strings.
	 * @param {string[]} deadlines - Array of listing deadlines as UNIX timestamps in seconds.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async listItems(
		contract: marketplaceContract,
		nftContracts: string[],
		tokenIds: string[],
		amounts: string[],
		prices: string[],
		deadlines: string[],
	): Promise<Receipt> {
		const sender = await this.getSender();

		const receipt = await contract.methods
			.listItems(nftContracts, tokenIds, amounts, prices, deadlines)
			.send({
				from: sender,
			});

		return receipt;
	}

	/**
	 * Cancels the listing of the token and returns it to the seller using Web3.js.
	 *
	 * @param {marketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} itemId - The ID of the listed token on the marketplace.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	async cancelListing(contract: marketplaceContract, itemId: string): Promise<Receipt> {
		const sender = await this.getSender();

		// Send the transaction to call the `cancelListing` function
		const receipt = await contract.methods.cancelListing(itemId).send({
			from: sender,
		});

		return receipt;
	}
	/**
	 * Cancels the listings of the expired items and returns them to the seller using Web3.js.
	 *
	 * @param {marketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string[]} itemIds - Array of IDs of the expired items on the marketplace.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async cancelExpiredListings(
		contract: marketplaceContract,
		itemIds: string[],
	): Promise<Receipt> {
		const sender = await this.getSender();

		// Send the transaction to call the `cancelExpiredListings` function
		const receipt = await contract.methods.cancelExpiredListings(itemIds).send({
			from: sender,
		});

		return receipt;
	}

	/**
	 * Performs the sale of a marketplace item using Web3.js.
	 *
	 * @param {marketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} itemId - The ID of the listed token on the marketplace.
	 * @param {string} price - The price of the item in wei, as required by the function (must match the listing price).
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async purchaseItem(
		contract: marketplaceContract,
		itemId: string,
		price: string,
	): Promise<Receipt> {
		const sender = await this.getSender();
		// Send the transaction to call the `purchaseItem` function
		const receipt = await contract.methods.purchaseItem(itemId).send({
			from: sender,
			value: price,
		});

		return receipt;
	}
}

// Module Augmentation
declare module 'web3' {
	interface Web3Context {
		marketplace: Web3MarketplacePlugin;
	}
}
