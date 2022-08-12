import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import axios from '../../axios'

function saveAs(blob:any, fileName:any) {
  var url = window.URL.createObjectURL(blob);

  var anchorElem = document.createElement("a");
  anchorElem.setAttribute('style' , "display: none");
  anchorElem.href = url;
  anchorElem.download = fileName;

  document.body.appendChild(anchorElem);
  anchorElem.click();

  document.body.removeChild(anchorElem);

  // On Edge, revokeObjectURL should be called only after
  // a.click() has completed, atleast on EdgeHTML 15.15048
  setTimeout(function() {
      window.URL.revokeObjectURL(url);
  }, 1000);
}

const Folders: NextPage = () => {
  const [ folders, setFolders ] = useState([])
  const [ selectedFolder, setSelectedFolder ] = useState<any|null>(null)
  const onFolderClick = (folder: any) => {
    setSelectedFolder(folder)
  }
  const onFileClick = async (file: any) => {
    let fileRes = await axios.reqApi('api/exp/'+file.id).getBuffer()
    const url = window.URL.createObjectURL(new Blob([fileRes.data], { type: fileRes.headers['content-type'] }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', file.file_name)
    document.body.appendChild(link)
    link.click()
  }
  const fetchFolders = async () => {
    let folderRes = await axios.reqApi('api/exp').get()
    setFolders(folderRes.data)
  }
  useEffect(() => {
    fetchFolders()
  }, [])
  return (
    <div>
      <table>
        <tbody>
          {
            folders.map((folder: any) => {
              return (
                <tr key={folder.id}>
                  <td onClick={ () => onFolderClick(folder) } style={{ cursor: 'pointer' }}>{folder.folder_name}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
      {
        selectedFolder &&
        (() => (
          <div>
            <hr />
            <table>
              <tbody>
                {
                  selectedFolder.files.map((file: any) => {
                    return (
                      <tr key={file.id}>
                        <td onClick={ () => onFileClick(file) } style={{ cursor: 'pointer' }}>{file.file_name}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </div>
        ))()
      }
    </div>
  )
}

export default Folders
