import { useState } from 'react'
import { supabase } from '../../utils/supabaseClient'
import { ethers } from 'ethers'
import axios from '../../axios'
import { useDispatch } from 'react-redux'
import { set_token_action } from '../../store/actions/user'

export default function Auth() {
  const dispatch = useDispatch()
  const [ loginState, setLoginState ] = useState<string|null>(null)

  const handleLogin = async () => {
    try {
      setLoginState('Connecting to your wallet...')
      const ethereum = (window as any).ethereum
      if(!ethereum) {
        setLoginState('No Metamask wallet, please install.')
        return
      }
      const provider = new ethers.providers.Web3Provider(ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const walletAddr = await signer.getAddress()
      console.log('wallet: ', walletAddr)
      
      const nonceRes = await axios.reqApi('api/auth/nonce').post({ walletAddr })
      
      const signature = await signer.signMessage(nonceRes.data.nonce)
      console.log('signature: ', signature)
      setLoginState('Connected, Wallet Address: ' + walletAddr)
      
      const walletRes = await axios.reqApi('api/auth/wallet').post({ walletAddr, nonce: nonceRes.data.nonce, signature })
      
      console.log(walletRes.data);

      await supabase.auth.setAuth(walletRes.data.token)
      
      dispatch(set_token_action(walletRes.data.token))
    } catch (error: any) {
      console.log(error)
    } finally {
      
    }
  }

  return (
    <div>
      <p>{loginState}</p>
      {<button onClick={ handleLogin }>Sign In With Metamask</button>}
    </div>
  )
}