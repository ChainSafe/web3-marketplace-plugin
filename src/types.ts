import { Contract } from 'web3';
import { marketplaceABI } from './contracts/marketplaceContract';

export type MarketplaceContract = Contract<typeof marketplaceABI>;

export type CollectionToken = {
	token_id: string;
	token_type: string;
	contract_address: string;
	uri: string;
	metadata: {
		image: string;
		name: string;
		tokenType: string;
	};
	project_id: string;
	chain_id: number;
	collection_id: string;
	supply: string;
};

export type MarketplaceItem = {
	id: string;
	chain_id: number;
	project_id: string;
	marketplace_id: string;
	token: {
		token_id: string;
		token_type: string;
		contract_address: string;
		uri: string;
		metadata: {
			image: string;
			name: string;
			tokenType: string;
		};
	};
	marketplace_contract_address: string;
	seller: string;
	buyer: string;
	deadline: number;
	price: string;
	status: string;
	listed_at: number;
};

export type MarketplaceItemsResult = {
	page_number: number;
	page_size: number;
	total: number;
	cursor: string;
	items: MarketplaceItem[];
};

export type Owner = {
	owner: string;
	supply: string;
};

export type TokenOwnersResult = {
	page_number: number;
	page_size: number;
	total: number;
	cursor: string;
	owners: Owner[];
};
