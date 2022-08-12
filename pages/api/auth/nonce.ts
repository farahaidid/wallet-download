// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '../../../utils/supabaseClient'
import { v4 as uuidv4 } from 'uuid'

type Data = {
  name: string
}

export default async(
  req: NextApiRequest,
  res: NextApiResponse//<Data>
) => {
  const { walletAddr } = req.body
  let { data, error } = await supabase
  .from('users')
  .select('nonce')
  .eq('walletAddr', walletAddr)

  const nonce = uuidv4()
  if(data && data?.length > 0){
    await supabase.from('users').update({ nonce }).match({ walletAddr })
    res.status(200).json({ nonce })
  }else{
    await supabase.from('users').insert({ nonce, walletAddr })
    res.status(200).json({ nonce })
  }
}
