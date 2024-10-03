import Web3 from 'web3';
import * as dotenv from 'dotenv';
import { Web3MarketplacePlugin, marketplaceABI, marketplaceContract } from '../../src';
import { marketplaceAddress} from '../fixtures';

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
        console.log(web3.eth.accounts.wallet)
        web3.config.defaultAccount = web3.eth.accounts.wallet[0].address;
        contract = new web3.eth.Contract(marketplaceABI, marketplaceAddress);
    });

    it('should list an item on the marketplace', async () => {
        const deadline = (Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60).toString();
    
        const receipt = await web3.marketplace.listItem(contract,"0xf08e9decb486adf217841645c858920b51adb642", "0", "1", deadline);
        expect(receipt).toBeDefined();  
    });
    
});
