// src/components/Menu.jsx
import React, { useContext } from 'react';
import styles from './menu.module.css';
import { FaUsers } from "react-icons/fa";
import { UserContext } from '../../contextapi/CreateContext';


function Menu() {
    const {isdataRefresh,
        setIsdataRefresh,} = useContext(UserContext);
    return (
        <div className={styles.menu}>
            <div className={styles.header} >
                <h3>Menu</h3>
            </div>
            <div className={styles.buttons}>
                <button className={styles.menuButton} onClick={()=>{setIsdataRefresh(prev=>!prev);
                    console.log("isdatarefresh",isdataRefresh);
                    window.location.reload();

                }}><FaUsers size={30}/>
                    <p>User</p></button>
            </div>
        </div>
    );
}

export default Menu;
