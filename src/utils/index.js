const contractAddress = `TS8ZXq5VqpLm7Yvh4kZTEkoM2q5rqM9j98`;

const Utils = {
    tronWeb: false,
    contract: false,
    
    async setTronWeb(tronWeb) {
        console.log('contractAddress', contractAddress)
        this.tronWeb = tronWeb;
        this.contract = await tronWeb.contract().at(contractAddress);
    }

};

export default Utils;

