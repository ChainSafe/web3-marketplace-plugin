import Web3 from 'web3';
import * as dotenv from 'dotenv';
import { Web3MarketplacePlugin, marketplaceABI, marketplaceContract } from '../../src';
import { marketplaceAddress, collectionAddress } from '../fixtures';

dotenv.config();

describe('Web3MarketplacePlugin method Tests', () => {
    const provider = process.env.provider;
    const pk = process.env.privatekey;
    let contract: marketplaceContract; 
    let web3: Web3;
    beforeAll(() => {
        web3 = new Web3(provider);
		web3.registerPlugin(new Web3MarketplacePlugin());
        if(pk)
        web3.eth.accounts.wallet.add(web3.eth.accounts.privateKeyToAccount(pk));
        web3.defaultAccount = web3.eth.accounts.wallet[0].address;
        contract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);
    });

    it('should list an item on the marketplace', async () => {
        const deadline = (Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60).toString();
    
        const receipt = await web3.marketplace.listItem(contract,collectionAddress, "0", "1", deadline);
        expect(receipt).toBeDefined();  
    });

    it('should cancel an item on the marketplace', async () => {
    
        const receipt = await web3.marketplace.cancelListing(contract, "0");
        expect(receipt).toBeDefined();  
    });
    
});
