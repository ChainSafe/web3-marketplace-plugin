import { Web3PluginBase, Receipt } from 'web3';
import {
	MarketplaceContract,
	CollectionToken,
	MarketplaceItemsResult,
	TokenOwnersResult,
} from './types';
import { MarketplaceApiErrors, UnknownAccountError } from './errors';

export class Web3MarketplacePlugin extends Web3PluginBase {
	public pluginNamespace = 'marketplace';
	private baseUrl: string;

	constructor(baseUrl: string = 'https://api.gaming.chainsafe.io/v1') {
		super();
		this.baseUrl = baseUrl;
	}

	private getSender = async (): Promise<string> => {
		const accounts: string[] = await this._requestManager.send({ method: 'eth_accounts' });
		let sender;
		// check if there are any accounts within wallet provider, if not use the default account.
		if (accounts.length === 0) {
			sender = this.config.defaultAccount || this.defaultAccount;
		} else {
			sender = accounts[0];
		}
		if (!sender) {
			throw new UnknownAccountError(
				"No account found, please connect to a wallet provider or set a default account - 'web3.defaultAccount = <your address>'",
			);
		}
		return sender;
	};

	private fetchData = async <ReturnType>(url: string, errorMessage: string): Promise<ReturnType> => {
		const response = await fetch(url)

		if (!response.ok) {
			throw new MarketplaceApiErrors(errorMessage, response.statusText);
		}

		// Parse the response as JSON
		const data = (await response.json());
		return data;
	};

	/**
	 * Places an item for sale on the marketplace using Web3.js.
	 *
	 * @param {MarketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} nftContract - The address of the NFT contract.
	 * @param {string} tokenId - The ID of the token in the NFT contract.
	 * @param {string} price - The listing price in wei as a string.
	 * @param {string} deadline - The listing deadline as a UNIX timestamp in seconds, or "0" if no deadline.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async listItem(
		contract: MarketplaceContract,
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
	 * @param {MarketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string[]} nftContracts - Array of NFT contract addresses.
	 * @param {string[]} tokenIds - Array of token IDs in the NFT contracts.
	 * @param {string[]} amounts - Array of token amounts as strings.
	 * @param {string[]} prices - Array of listing prices in wei as strings.
	 * @param {string[]} deadlines - Array of listing deadlines as UNIX timestamps in seconds.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async listItems(
		contract: MarketplaceContract,
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
	 * @param {MarketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} itemId - The ID of the listed token on the marketplace.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	async cancelListing(contract: MarketplaceContract, itemId: string): Promise<Receipt> {
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
	 * @param {MarketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string[]} itemIds - Array of IDs of the expired items on the marketplace.
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async cancelExpiredListings(
		contract: MarketplaceContract,
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
	 * @param {MarketplaceContract} contract - The initialized Web3 contract instance of the marketplace.
	 * @param {string} itemId - The ID of the listed token on the marketplace.
	 * @param {string} price - The price of the item in wei, as required by the function (must match the listing price).
	 * @returns {Promise<Receipt>} - Returns the transaction receipt object.
	 */
	public async purchaseItem(
		contract: MarketplaceContract,
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

	/**
	 * Gets all items in a marketplace.
	 * Path: https://api.gaming.chainsafe.io/v1/projects/{projectID}/marketplaces/{marketplaceID}/items
	 *
	 * @param {string} marketplaceId - Marketplace ID to query.
	 * @param {string} customProjectId - Project ID to query.
	 * @returns {Promise<MarketplaceItemsResult>} - Returns the marketplace items response object.
	 */
	public async getMarketplaceItems(
		marketplaceId: string,
		customProjectId: string,
	): Promise<MarketplaceItemsResult> {
		// Construct the full URL with path project ID as a query parameter
		const url = `${this.baseUrl}/projects/${customProjectId}/marketplaces/${marketplaceId}/items`;

		const res = await this.fetchData<MarketplaceItemsResult>(url, 'Failed to fetch marketplace items');
		return res;
	}

	/**
	 * Gets the information of a token in a collection via ID.
	 * Path: https://api.gaming.chainsafe.io/v1/projects/{projectID}/collections/{collectionID}/tokens/{tokenID}
	 * @param {string} customProjectId - Project ID to query.
	 * @param {string} collectionId - Collection ID to query.
	 * @param {string} tokenId - Token ID to query
	 * @returns {Promise<CollectionToken>} - Returns the token information response object.
	 */
	public async getCollectionToken(
		customProjectId: string,
		collectionId: string,
		tokenId: string,
	): Promise<CollectionToken> {
		// Construct the full URL with path parameters
		const url = `${this.baseUrl}/projects/${customProjectId}/collections/${collectionId}/tokens/${tokenId}`;

		const data = await this.fetchData<CollectionToken>(url, 'Failed to fetch collection token');
		return data;
	}

	/**
	 * Gets the owners of a token ID in a collection.
	 * Path: https://api.gaming.chainsafe.io/v1/projects/{projectID}/collections/{collectionID}/tokens/{tokenID}/owners
	 *
	 * @param {string} customProjectId - Project ID to query.
	 * @param {string} collectionId - Collection ID to query.
	 * @param {string} tokenId - Token ID to query.
	 * @returns {Promise<TokenOwnersResult>} - Returns the owners response object.
	 */
	public async getTokenOwners(
		customProjectId: string,
		collectionId: string,
		tokenId: string,
	): Promise<TokenOwnersResult> {
		// Construct the full URL with path parameters
		const url = `${this.baseUrl}/projects/${customProjectId}/collections/${collectionId}/tokens/${tokenId}/owners`;

		// Send the GET request to the API
		const data = await this.fetchData<TokenOwnersResult>(url, 'Failed to fetch token owners');
		return data;
	}
}

// Module Augmentation
declare module 'web3' {
	interface Web3Context {
		marketplace: Web3MarketplacePlugin;
	}
}
