import Web3 from 'web3';
import * as dotenv from 'dotenv';
import { Web3MarketplacePlugin } from '../../src';
import {
	marketplaceId,
	customProjectId,
	collectionId,
} from '../fixtures';

dotenv.config();

describe('Web3MarketplacePlugin method Tests', () => {
	const provider = process.env.provider;
	const pk = process.env.PRIVATEKEY;
	let web3: Web3;
	beforeAll(() => {
		web3 = new Web3(provider);
		web3.registerPlugin(new Web3MarketplacePlugin());
		if (pk) web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(pk));
		web3.defaultAccount = web3.eth.accounts.wallet[0].address;
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
