import React, { Component } from 'react';
import Web3 from 'web3';
import './App.css';
import Picture from '../abis/Picture.json'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values


class App extends Component {


  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  constructor(props){
    super(props);
    this.state = {
      account:'',
      buffer:null,
      contract: null,
      pictureHash:'QmcQ7Z69rA3Dwi2y5Fw8ZqikGjezmS8pfeUhxj98wcrDXH'
    };
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = Picture.networks[networkId]
    if (networkData){
      const abi = Picture.abi
      const address = networkData.address
      const contract = web3.eth.Contract(abi,address)
      this.setState({contract})
      const pictureHash = await contract.methods.get().call()
      this.setState({pictureHash})
    }else {
      window.alert('smart contract not deployed to deticted network')
    }
  }

  captureFile = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend =() =>{
      this.setState({buffer:Buffer(reader.result)})
    }
  }

  
  onSubmit = (event) =>{
    event.preventDefault()
    console.log("submiting the form")
    ipfs.add(this.state.buffer, (error,result) => {
      console.log('Ipfs result', result)
      const pictureHash = result[0].hash
      if(error){
        console.error(error)
        return
      }
      this.state.contract.methods.set(pictureHash).send({from: this.state.account}).then((r) =>{
        this.setState({pictureHash})
      })
    })
  }
  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
            Picture uploader
          </a>
          <ul className="navbar-nav px-3"> 
            <li className="nav-item test-nowrap d-none d-sm-none d-sm-block">
              <small className="text-white">{this.state.account}</small>
            </li>
          </ul >            
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={`https://ipfs.infura.io/ipfs/${this.state.pictureHash}`} />
                </a>
                <p>&nbsp;</p>
                <h2>Change picture</h2>
                <form  onSubmit={this.onSubmit} > 
                  <input type='file' onChange={this.captureFile} />
                  <input type='submit'/>
                </form>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
