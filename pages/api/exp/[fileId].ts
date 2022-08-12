// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken'
import { ethers } from 'ethers'
import { supabase } from '../../../utils/supabaseClient'
import path from 'path'
import mime from 'mime'
import fs from 'fs'

export default async(
  req: NextApiRequest,
  res: NextApiResponse//<Data>
) => {
  try{
    console.log(req.query);
    const { fileId } = req.query
    const { data: files, error } = await supabase
    .from('files')
    .select(`
      *,
      folder:folder_id ( id, folder_url )
    `)
    .eq('id', fileId)

    console.log(files)

    if(files && files?.length > 0){
      const file = files[0]
      const filepath = 'folders/' + file.folder.folder_url + '/' + file.url

      const { data, error } = await supabase.storage
      .from('wallet-download')
      .download(filepath)
      const blob = data as any
      const buffer = Buffer.from( await blob.arrayBuffer() );
      var mimetype = mime.getType(file.url) as string;
      res.setHeader('Content-Type', mimetype)
      res.send(buffer)
    }else{
      res.status(400).send('File Not Found')
    }
  }catch(e){
    console.log(e);
    res.status(400).send(e)
  }
}
