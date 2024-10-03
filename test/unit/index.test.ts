import { Web3, core } from 'web3';
import { Web3MarketplacePlugin } from '../../src';

describe('Web3MarketplacePlugin Tests', () => {
	it('should register Web3MarketplacePlugin plugin on Web3Context instance', () => {
		const web3Context = new core.Web3Context('http://127.0.0.1:8545');
		web3Context.registerPlugin(new Web3MarketplacePlugin());
		expect(web3Context.marketplace).toBeDefined();
	});

	it('should register Web3MarketplacePlugin plugin on Web3 instance', () => {
		const web3 = new Web3('http://127.0.0.1:8545');
		web3.registerPlugin(new Web3MarketplacePlugin());
		expect(web3.marketplace).toBeDefined();
	});
});
