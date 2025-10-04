import React, { useState, useEffect, useContext } from 'react'
import { IoMdAdd } from "react-icons/io";
import { CiCircleRemove } from "react-icons/ci";

import Styles from "./user.module.css";
import { api_url } from '../../../constansts/apiUrl';
import AddModal from '../../../UpdateModal';
import UpdateModal from '../../../CreateModal'
import UsersView from './usersView/UsersView';
import { UserContext } from '../../../contextapi/CreateContext';
function User() {
    const { users,
        setUsers, searchResults,
        setSearchResults, } = useContext(UserContext);
    const [key, setKey] = useState('');
    const [ismodaldisplay, setIsmodaldisplay] = useState(false);
    useEffect(() => {
        if (key.trim() !== "") {
            handleSearch(key);  // Call your search/filter function
        } else {
            setUsers([]);
        }
        // console.log("userss:", users);
    }, [key]);

    const handleSearch = async (searchTerm) => {
        try {
            const url = `${api_url}?search=${encodeURIComponent(searchTerm.trim())}`;
            const res = await fetch(url);
            const data = await res.json();
            if (data.users) {
                setSearchResults(data.users); // Only update search results
            } else {
                setSearchResults([]);
            }
        } catch (err) {
            console.error('❌ Search error:', err.message);
            setSearchResults([]);
        }
    };
    return (
        <div className={Styles.user}>

            <div className={Styles.sub_header}>
                <h1>
                    Users
                </h1>
                <button className={Styles.addbtn} onClick={() => { setIsmodaldisplay(true) }}><IoMdAdd size={25} />
                    <p>Create User</p>
                </button>
            </div>
            <div className={Styles.screen_veiw}>

                <div className={Styles.usersview}>
                    <UsersView searchResults={searchResults} />
                </div>
            </div>
            {ismodaldisplay &&

                <UpdateModal ismodaldisplay={ismodaldisplay} setIsmodaldisplay={setIsmodaldisplay} />
            }
        </div>
    )
}

export default User