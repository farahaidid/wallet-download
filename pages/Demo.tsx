import Auth from '../components/auth/Auth'
import FileExplorer from '../components/FileExplorer'
import { useDispatch, useSelector } from 'react-redux'
import { logout_action } from '../store/actions/user'

const DemoPage = () => {
  const token: any = useSelector((state: any) => state.USER.token)
  const dispatch = useDispatch()
  const logout = () => {
    dispatch(logout_action(null))
  }
  return (
    <div>
      { !token && <Auth /> }
      {
        token && <button onClick={ logout }>Log Out</button>
      }
      <hr />
      { token && <FileExplorer /> }
    </div>
  )
}

export default DemoPage
