import { Web3, core, Contract } from 'web3';
import { Web3MarketplacePlugin } from '../src';
import { marketplaceABI } from '../src/marketplaceContract';

describe('Web3MarketplacePlugin Tests', () => {
	it('should register Web3MarketplacePlugin plugin on Web3Context instance', () => {
		const web3Context = new core.Web3Context('http://127.0.0.1:8545');
		web3Context.registerPlugin(new Web3MarketplacePlugin());
		expect(web3Context.marketplace).toBeDefined();
	});

	describe('TemplatePlugin method tests', () => {
		let consoleSpy: jest.SpiedFunction<typeof global.console.log>;

		let web3: Web3;

		beforeAll(() => {
			web3 = new Web3('https://ethereum-sepolia-rpc.publicnode.com');
			web3.registerPlugin(new Web3MarketplacePlugin());
			consoleSpy = jest.spyOn(global.console, 'log').mockImplementation();
		});

		afterAll(() => {
			consoleSpy.mockRestore();
		});

		it('should call marketplaceContract and list item', () => {
			const contract = new web3.eth.Contract(
				marketplaceABI,
				'0x76b4c2877d277a1cb5565027c67241e93f6f52ab',
			);
			web3.marketplace.listItem(contract, '', '', '', '');
			expect(consoleSpy).toHaveBeenCalledWith('test-param');
		});
	});
});
