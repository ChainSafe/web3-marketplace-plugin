import { Contract } from 'web3';
import { marketplaceABI } from './contracts/marketplaceContract';

export type marketplaceContract = Contract<typeof marketplaceABI>;
