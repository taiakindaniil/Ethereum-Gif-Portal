import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import abi from './utils/GifPortal.json'
import './style/App.css'

import GIFInput from './components/GIFInput'
import Header from './components/Header'
import Container from './components/Container'

declare const window: any

type Gif = {
  user: string,
  timestamp: Date,
  url: string
}

export default function App() {
  const [currentAccount, setCurrentAccount] = useState('')
  const [allGifs, setAllGifs] = useState<Gif[]>([])
  const [inputURL, setInputURL] = useState('')

  const contractAddress = '0x8328C5191f9C961e5DEC6cA59355a2aFA700790E'
  const contractABI = abi.abi

  const { ethereum } = window

  useEffect(() => {
    checkIfWalletIsConnected()

    let gifPortalContract: ethers.Contract
  
    const onNewGif = (from: string, url: string, timestamp: number) => {
      console.log("NewGif", from, url, timestamp)
      setAllGifs(prevGifs => [
        {
          user: from,
          timestamp: new Date(timestamp * 1000),
          url: url
        },
        ...prevGifs
      ])
    }
  
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
  
      gifPortalContract = new ethers.Contract(contractAddress, contractABI, signer)
      gifPortalContract.on("NewGif", onNewGif)
    }
  
    return () => {
      if (gifPortalContract) {
        gifPortalContract.off("NewGif", onNewGif);
      }
    }
  }, [])

  const getAllGifs = async () => {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const gifPortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let gifs = await gifPortalContract.getAllGifs() as Gif[]
        let copiedGifs = [...gifs].reverse()
        
        setAllGifs(copiedGifs)
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.log("Make sure you have metamask!")
        return
      } else {
        console.log("We have the ethereum object", ethereum)
      }

      const accounts = await ethereum.request({ method: "eth_accounts" })

      if (accounts.length !== 0) {
        const account = accounts[0]
        console.log("Found an authorized account:", account)
        setCurrentAccount(account)
        getAllGifs()
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error)
    }
  }

   const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask!")
        return
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" })

      console.log("Connected", accounts[0])
      setCurrentAccount(accounts[0])
      getAllGifs()
    } catch (error) {
      console.log(error)
    }
  }

  async function addGif() {
    try {
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum)
        const signer = provider.getSigner()
        const gifPortalContract = new ethers.Contract(contractAddress, contractABI, signer)

        let count = await gifPortalContract.getTotalGifs()
        console.log("Retrieved total gif count...", count.toNumber())

        const gifTxn = await gifPortalContract.addGif(inputURL)
        console.log("Mining...", gifTxn.hash)
        setInputURL('')

        await gifTxn.wait()
        console.log("Mined -- ", gifTxn.hash)

        count = await gifPortalContract.getTotalGifs()
        console.log("Retrieved total wave count...", count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!")
      }
    } catch (error) {
      console.log(error)
    }
  }

  const gifsElements: JSX.Element[] = allGifs.map((gif, index) => {
      return (
        <div key={index}>
          <img src={gif.url} alt='' />
        </div>
      )
  })
  
  return (
    <div className='main-container'>
      <div className='data-container'>
        <Header />

        {
          currentAccount ? (
            <div>
              <GIFInput
                value={inputURL}
                handleClick={addGif}
                handleChange={
                  (e: any) => setInputURL(e.target.value)
                }
              />

              <Container
                gifs={gifsElements}
              />
            </div>
          ) : (
            <button className='connect-wallet-button' onClick={connectWallet}>
              Connect Wallet
            </button>
          )
        }
      </div>
    </div>
  )
}
