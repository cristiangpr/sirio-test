/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'
import Image from "next/image";
import styles from "./page.module.css";
import {Container, Box, TextField, CssBaseline, Button} from "@material-ui/core";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {  whitelist } from '@/utils';
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';
import { AccountId, LedgerId } from '@hashgraph/sdk';
import APIWebClient from './api/ApiWebClient';
import { CONTRACT_ID } from '@/constants';
import { ethers, getAddress } from 'ethers';

 const  Home:React.FC = () => {
  const [address, setAddress] = useState<string>("")
  const [whitelisted, setWhitelisted] = useState<string>("")
  const [isWhitelisted, setIsWhitelisted] = useState<boolean | undefined>(undefined)
  const [message, setMessage] = useState<string>("")
  const [error, setError] = useState<string>("")
 

const hashconnect= useRef<HashConnect>();
const state: HashConnectConnectionState = HashConnectConnectionState.Disconnected;
const pairingData = useRef<SessionData | null>(null)

const setUpHashConnectEvents= useCallback(() => {
    hashconnect.current?.pairingEvent.on((newPairing) => {
        pairingData.current = newPairing;
    })

    hashconnect.current?.disconnectionEvent.on((data) => {
        pairingData.current = null;
    });

    hashconnect.current?.connectionStatusChangeEvent.on((connectionStatus) => {
      const state = connectionStatus;
    })
},[])
const init = useCallback(async () => {
    const appMetadata = {
    name: "Sirio test",
    description: "coding test for Sirio",
    icons: ["https://www.sirio.finance/BrandingAssets-main/Brand/Logo.svg"],
    url: "localhost"
  };
    //create the hashconnect instance
    hashconnect.current = new HashConnect(LedgerId.TESTNET, "c075ba3c595fe6d20a76d13f93ce57a3", appMetadata, true);

    //register events
    setUpHashConnectEvents();

    //initialize
    await hashconnect.current.init();

    hashconnect.current?.openPairingModal();

   
  }, [setUpHashConnectEvents]);

  const handleWhitelist = async () => {
    console.log('accounts', pairingData.current?.accountIds )
    if (pairingData.current && hashconnect.current) {
    const accountId = AccountId.fromString(pairingData.current.accountIds[0])

    const signer = hashconnect.current.getSigner(accountId)
    console.log("signer", signer)
    try {
      await whitelist(address, signer)
      setWhitelisted(address)
    } catch (error: any) {
 
      setError(error.message)
    }
  }
  }
  const handleGetContractState = async (idOrAddress: string) => {
    setIsWhitelisted(undefined)
    setWhitelisted("")
    const state = await APIWebClient.getContractState(idOrAddress)
    console.log("state", state)
    if (state) {
      const hex = ethers.toQuantity(state.state[1].value)
      console.log('hex', hex)
      const string = ethers.toUtf8String(hex)
      const text = string.split('\x00')
      console.log('text', text)
      setMessage(text[0])
        const hexAdd = ethers.toQuantity(state.state[2].value)
      console.log('hexAdd', hexAdd)
       setWhitelisted(hexAdd)
     
    }
  }
  const handleFocus = () => {
    setError("")
    setIsWhitelisted(undefined)
  }
  const checkWhitelisted = () => {
    handleGetContractState(CONTRACT_ID)
    try {
    if (getAddress(whitelisted) === getAddress(address)) {
      setIsWhitelisted(true)
    } else {
      setIsWhitelisted(false)
    }
  } catch (error: any) {
    setError(error.message)
  }
  }


  useEffect(() => {
    const initHashConnect = async () =>{
      setUpHashConnectEvents()
      await init()
      
    }
    try {
    initHashConnect()
     } catch (error) {
        console.log(error)
      }
  },[init, setUpHashConnectEvents])

  useEffect(() => {
  try {
    handleGetContractState(CONTRACT_ID)
     } catch (error) {
        console.log(error)
      }
  },[])
  return (
    <>
    <CssBaseline />
   <main className={styles.main}>
    <Image src="https://www.sirio.finance/BrandingAssets-main/Brand/Logo.svg" alt="Sirio Logo" width={100} height={100}/>
      <Box sx={{height: 50}}>
        <h2>{message ? message : ""}</h2>
      </Box>
      
           <Box sx={{height: '25%'}}>
        <TextField onChange={(e) => setAddress(e.target.value)} style={{width: 500}} label="0x...." variant="outlined" helperText="enter address" onFocus={() => handleFocus()}/>
      </Box>
      <Box>
        <Button variant='contained' color='primary' style={{margin: 5}} onClick={() => handleWhitelist()}>Whitelist Address</Button>
         <Button variant='contained' color='primary' onClick={() => checkWhitelisted()}>Check Address</Button>
      </Box>
      <Box>{error}</Box>
      {isWhitelisted === true && (
        <Box>Address Whitelisted</Box>
      )}
         {isWhitelisted === false && (
        <Box>Address NOT Whitelisted</Box>
      )}
    </main>
    </>
  );
}
export default Home


