export type Tx = {
    accessList: any;
    blockHash: string;
    blockNumber: number;
    chainId: number;
    confirmations: number;
    creates: any;
    data: Data;
    from: string;
    to: string;
    gasLimit: number;
    gasUsed: string;
    hash: string;
    nonce: number;
    transactionIndex: number;
    type: number;
    value: string;
    timestamp: number
};

type Data = {
    args: [];
    name: string;
    sighash: string;
    signature: string;
    value: string;
}
