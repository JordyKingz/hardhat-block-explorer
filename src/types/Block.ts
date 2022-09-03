export type Block = {
    number: number;
    timestamp: number;
    hash: string;
    parentHash: string;
    nonce: string;
    _difficulty: number;
    gasLimit: number;
    gasUsed: string;
    miner: string;
    extraData: string;
    baseFeePerGas: string;
    transactions: string[];
};