import { marketplaceABI } from './contracts/marketplaceContract';
import { Contract } from 'web3';

export type marketplaceContract = Contract<typeof marketplaceABI>;
