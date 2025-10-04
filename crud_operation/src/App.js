import React from 'react'
import UserProvider from './contextapi/UserProvider';
import Menu from './dashboard/menu/Menu';
import "./App.css";
import User from './dashboard/main/users/User';
function App() {
  return (
    <UserProvider>
      <div className='app'>
        <Menu />
        <User />
      </div>
      

    </UserProvider>
  )
}

export default App