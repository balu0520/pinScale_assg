import { useState } from 'react'
import './index.css'
import {AiFillHome,AiOutlineTransaction} from 'react-icons/ai'
import {BiSolidUser} from 'react-icons/bi'
import { Link } from 'react-router-dom'
import {MdLogout} from 'react-icons/md'

const SideBar = props => {
    const {activeId,onClickLogout} = props 
    const onClickLogoutBtn = () => {
        onClickLogout()
    }


    return (
        <div className='sidebar-container'>
            <div>
                <div className='sidebar-sub-container'>
                    <img src="https://res.cloudinary.com/daz94wyq4/image/upload/v1690731094/dollar_icon_o1ss4i.png" className='dollar-icon' alt='dollar icon' />
                    <h1 className='money'>Money </h1>
                    <h1 className='matters'>Matters</h1>
                </div>
                <div className='sidebar-buttons-container'>
                    <Link className={`sidebar-button-container ${activeId === 0 ? 'active' : ''}`} to="/user-dashboard">
                        <AiFillHome className={`sidebar-icon ${activeId === 0 ? 'active-heading' : ''}`}/>
                        <p className={`button-name ${activeId === 0 ? 'active-heading' : ''}`}>Dashboard</p>
                    </Link>
                    <Link className={`sidebar-button-container ${activeId === 1 ? 'active' : ''}`} to="/user-transactions">
                        <AiOutlineTransaction className={`sidebar-icon ${activeId === 1 ? 'active-heading' : ''}`}/>
                        <p className={`button-name ${activeId === 1 ? 'active-heading' : ''}`}>Transactions</p>
                    </Link>
                    <Link className={`sidebar-button-container ${activeId === 2 ? 'active' : ''}`} to="/user-profile">
                        <BiSolidUser className={`sidebar-icon ${activeId === 2 ? 'active-heading' : ''}`} />
                        <p className={`button-name ${activeId === 2 ? 'active-heading' : ''}`}>Profile</p>
                    </Link>
                </div>
            </div>
            <div className='profile-container'>
                <img src='https://res.cloudinary.com/daz94wyq4/image/upload/v1690710789/Avatar_dzpgxq.png' className='profile-pic' alt="profile pic"/>
                <div className='profile-sub-container'>
                    <h1 className='profile-name'>Rhye</h1>
                    <p className='profile-mail'>olivia@untitledui.com</p>
                </div>
                <MdLogout onClick={onClickLogoutBtn}/>
            </div>
        </div>
    )
}

export default SideBar