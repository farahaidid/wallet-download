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
    const token = req.headers.authorization || ''
    let decoded = jwt.verify(token.substring(7), process.env.SUPABASE_JWT_SECRET||'')
    const { data: folderJoins, error } = await supabase
    .from('user_folder_join')
    .select(`
      folder:folder_id(
        *,
        files(
          id,
          folder_id,
          file_name
        )
      )
    `)
    .eq('user_id', decoded.sub)

    console.log(folderJoins)
    const folders = folderJoins?.map(fj => fj.folder)

    res.status(200).json(folders || [])
  }catch(e){
    console.log(e);
    res.status(400).send(e)
  }
}
