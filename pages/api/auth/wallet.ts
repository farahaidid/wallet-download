// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers'
import { supabase } from '../../../utils/supabaseClient'

type Data = {
  name: string
}

export default async(
  req: NextApiRequest,
  res: NextApiResponse//<Data>
) => {
  try{
    const { walletAddr, nonce, signature } = req.body
    const signerAddr = ethers.utils.verifyMessage(nonce, signature)
    if(signerAddr !== walletAddr){
      throw new Error('Wrong Signature')
    }else{
      const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('nonce', nonce)
      .eq('walletAddr', walletAddr)
      .single()

      const token = jwt.sign({
        aud: 'authenticated',
        exp: Math.floor((Date.now() / 1000) + (60*60)),
        sub: user.id,
        user_metadata: {
          id: user.id
        },
        role: 'authenticated',
      }, process.env.SUPABASE_JWT_SECRET || '')

      res.status(200).json({ user, token })
    }
  }catch(e){
    console.log(e);
    res.status(400).send(e)
  }
}
