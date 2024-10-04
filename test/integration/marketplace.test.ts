import Web3 from 'web3';
import * as dotenv from 'dotenv';
import { Web3MarketplacePlugin, marketplaceABI, MarketplaceContract } from '../../src';
import {
	marketplaceAddress,
	marketplaceId,
	collectionAddress,
	customProjectId,
	collectionId,
} from '../fixtures';

dotenv.config();

describe('Web3MarketplacePlugin method Tests', () => {
	const provider = process.env.provider;
	const pk = process.env.privatekey;
	let contract: MarketplaceContract;
	let web3: Web3;
	beforeAll(() => {
		web3 = new Web3(provider);
		web3.registerPlugin(new Web3MarketplacePlugin());
		if (pk) web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(pk));
		web3.defaultAccount = web3.eth.accounts.wallet[0].address;
		contract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);
	});

	it('should list an item on the marketplace', async () => {
		const deadline = (Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60).toString();

		const receipt = await web3.marketplace.listItem(
			contract,
			collectionAddress,
			'2',
			'1000',
			deadline,
		);
		expect(receipt).toBeDefined();
	});

	it('should cancel an item on the marketplace', async () => {
		const receipt = await web3.marketplace.cancelListing(contract, '0');
		expect(receipt).toBeDefined();
	});

	it('should get items from marketplace', async () => {
		const result = await web3.marketplace.getMarketplaceItems(marketplaceId, customProjectId);
		expect(result.items.length).toBeGreaterThan(0);
	});

	it('should get collection token', async () => {
		const result = await web3.marketplace.getCollectionToken(customProjectId, collectionId, '0');
		expect(result.token_id).toEqual('0');
	});

	it('should get token owners', async () => {
		const result = await web3.marketplace.getTokenOwners(customProjectId, collectionId, '0');
		expect(result.owners).toBeDefined();
	});
});
