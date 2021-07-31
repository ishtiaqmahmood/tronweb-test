import React from 'react';
import TronLinkGuide from './components/TronLink/index.js';
import TronWeb from 'tronweb';
import Utils from './utils/index.js';


import './App.css';

const FOUNDATION_ADDRESS = '';
/// Add your contract address here
const contractAddress = '';

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
              tronwebaddress:'',

              tronWeb: {
                  installed: false,
                  loggedIn: false
              },
            }
    }

    async componentDidMount() {

        this.setState({loading:true})
        await new Promise(resolve => {
            const tronWebState = {
                installed: !!window.tronWeb,
                loggedIn: window.tronWeb && window.tronWeb.ready
            };

            if(tronWebState.installed) {
                this.setState({
                    tronWeb:
                    tronWebState
                });

                return resolve();
            }

            let tries = 0;

            const timer = setInterval(() => {
                if(tries >= 10) {
                    const TRONGRID_API = 'https://api.trongrid.io';

                    window.tronWeb = new TronWeb(
                        TRONGRID_API,
                        TRONGRID_API,
                        TRONGRID_API
                    );

                    this.setState({
                        tronWeb: {
                            installed: false,
                            loggedIn: false
                        }
                    });

                    clearInterval(timer);
                    return resolve();
                }

                tronWebState.installed = !!window.tronWeb;
                tronWebState.loggedIn = window.tronWeb && window.tronWeb.ready;

                if(!tronWebState.installed)
                    return tries++;

                this.setState({
                    tronWeb: tronWebState
                });

                resolve();
            }, 100);
        });

        if(!this.state.tronWeb.loggedIn) {
            // Set default address (foundation address) used for contract calls
            // Directly overwrites the address object as TronLink disabled the
            // function call
            window.tronWeb.defaultAddress = {
                hex: window.tronWeb.address.toHex(FOUNDATION_ADDRESS),
                base58: FOUNDATION_ADDRESS
            };

            window.tronWeb.on('addressChanged', () => {
                if(this.state.tronWeb.loggedIn)
                    return;

                this.setState({
                    tronWeb: {
                        installed: true,
                        loggedIn: true
                    }
                });
            });
        }

        await Utils.setTronWeb(window.tronWeb, contractAddress);
        const tmp_tronwebaddress = Utils.tronWeb.address.fromHex(((await Utils.tronWeb.trx.getAccount()).address).toString())
        console.log("tmp_tronwebaddress", tmp_tronwebaddress);
        await this.setState({tronwebaddress : tmp_tronwebaddress});
        console.log("tronwebaddress", this.state.tronwebaddress);

        let contract = await Utils.tronWeb
        .contract()
        .at("TS8ZXq5VqpLm7Yvh4kZTEkoM2q5rqM9j98")
            let abi = contract.abi;
            console.log(abi);
        
        // let result = await contract.usernameIsAvailable().call()
        // console.log('result: ', result);

        // try {
        //     let result = await contract.trxToSun().call()
        //     console.log('result: ', result);
        // } catch(error) {
        //     console.error("trigger smart contract error",error)
        // }
    
    }

    triggerSmartContract() {
        const Address = "TS8ZXq5VqpLm7Yvh4kZTEkoM2q5rqM9j98";//contract address
    
        try {
            let contract = Utils.tronWeb.contract().at(Address);
            //Use call to execute a pure or view smart contract method.
            // These methods do not modify the blockchain, do not cost anything to execute and are also not broadcasted to the network.
            let result = contract.getLeaderBoard().call();
            console.log('result: ', result);
        } catch(error) {
            console.error("trigger smart contract error",error)
        }
    }
    

    render() {
        if(!this.state.tronWeb.installed)
            return <TronLinkGuide />;

        if(!this.state.tronWeb.loggedIn)
            return <TronLinkGuide installed />;

        return (
              <div className='row'>
                <div className='col-lg-12 text-center' >
                  <p> Your Address : {this.state.tronwebaddress} </p>
                  <button onClick={this.triggerSmartContract}>Click</button>
                  <br/>
                  <br/>
                </div>
              </div>
        );
    }
}

export default App;
