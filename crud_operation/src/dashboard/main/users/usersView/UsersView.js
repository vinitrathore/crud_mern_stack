
import React, { useContext, useEffect, useMemo, useState } from 'react';
import Styles from './usersview.module.css';
import { FaPencilAlt } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { CiCircleRemove } from "react-icons/ci";
import { GoArrowUp, GoArrowDown } from "react-icons/go";

import { api_url } from '../../../../constansts/apiUrl';
import UpdateModel from '../../../../UpdateModal';
import { UserContext } from '../../../../contextapi/CreateContext';
import Toast from '../../../../Toast';

function UsersView() {
  const { isdataRefresh ,isnewUserAdded,setIsnewUserAdded} = useContext(UserContext);

  const [key, setKey] = useState('');
  const [users, setUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  const [userupdateID, setUserupdateID] = useState('');
  const [isupdatemodalvisible, setIsupdatemodalvisible] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };
  // Fetch users
  const fetchUsers = async (page = 1, limitValue = limit) => {
    try {
      const res = await fetch(`${api_url}?page=${page}&limit=${limitValue}`);
      const data = await res.json();
      setUsers(data?.users || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error("❌ Failed to fetch users:", error.message);
    }
  };

  useEffect(() => {
    if (searchResults.length === 0) {
      fetchUsers(page, limit);
    }
  }, [page, isdataRefresh, limit]);
useEffect(()=>{
  setPage(1);
},[isnewUserAdded])
  // Handle search
  useEffect(() => {
    if (key.trim() !== "") {
      handleSearch(key);
    } else {
      setSearchResults([]);
    }
  }, [key]);

  const handleSearch = async (searchTerm) => {
    try {
      const url = `${api_url}?search=${encodeURIComponent(searchTerm.trim())}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.users) {
        setSearchResults(data.users);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('❌ Search error:', err.message);
    }
  };

  // Sorting
  const handleSort = (field) => {
    setSortConfig((prev) => {
      if (prev.key === field) {
        return {
          key: field,
          direction: prev.direction === 'asc' ? 'desc' : 'asc'
        };
      } else {
        return {
          key: field,
          direction: 'asc'
        };
      }
    });
  };

  const sortedData = useMemo(() => {
    const baseData = [...(searchResults.length > 0 ? searchResults : users)];
    if (!sortConfig.key) return baseData;

    return baseData.sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase() || '';
      const bVal = b[sortConfig.key]?.toLowerCase() || '';
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [users, searchResults, sortConfig]);

  // Delete
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this user?");
    if (!confirm) return;

    try {
      const res = await fetch(`${api_url}/${id}`, { method: 'DELETE' });

      if (!res.ok) throw new Error("Failed to delete");

      setUsers(prev => prev.filter(user => user._id !== id));
      setSearchResults(prev => prev.filter(user => user._id !== id));
      showToast('User Deleted sucessfully', 'success')
    } catch (error) {
      console.error("❌ Delete failed:", error);
      alert("Something went wrong while deleting.");
    }
  };

  return (
    <div className={Styles.container}>
      <div className={Styles.header}>
        <div className={Styles.searchbar}>
          <input
            placeholder='Search'
            value={key}
            onChange={(e) => setKey(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(key);
              }
            }}
          />
          {key && (
            <CiCircleRemove
              className={Styles.clearIcon}
              onClick={() => setKey('')}
            />
          )}
        </div>

        <div className={Styles.limitSelector}>
          <label htmlFor="limit">Users per page:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => {
              setLimit(Number(e.target.value));
              setPage(1); // reset to first page
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
      </div>

      <div className={Styles.tableWrapper}>
        <div className={Styles.tableHeader}>
          <span onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
            Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <GoArrowUp /> : <GoArrowDown />)}
          </span>
          <span onClick={() => handleSort('email')} style={{ cursor: 'pointer' }}>
            Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? <GoArrowUp /> : <GoArrowDown />)}
          </span>
          <span onClick={() => handleSort('phone')} style={{ cursor: 'pointer' }}>
            Phone {sortConfig.key === 'phone' && (sortConfig.direction === 'asc' ? <GoArrowUp /> : <GoArrowDown />)}
          </span>
          <span>Actions</span>
        </div>

        <div className={Styles.tableBody}>
          {sortedData.length === 0 ? (
            <p className={Styles.noUsers}>No users found.</p>
          ) : (
            sortedData.map((user) => (
              <div className={Styles.tableRow} key={user._id}>
                <span>{user.name}</span>
                <span>{user.email}</span>
                <span>{user.phone}</span>
                <span className={Styles.actions}>
                  <button
                    className={Styles.edit}
                    onClick={() => {
                      setIsupdatemodalvisible(true);
                      setUserupdateID(user._id);
                    }}
                  >
                    <FaPencilAlt />
                  </button>
                  <button
                    className={Styles.delete}
                    onClick={() => handleDelete(user._id)}
                  >
                    <MdDelete />
                  </button>
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {searchResults.length === 0 && (
        <div className={Styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>
          <span className={Styles.currentPage}>Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
          >
            Next
          </button>
        </div>
      )}
 {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {isupdatemodalvisible && (
        <UpdateModel
          id={userupdateID}
          ismodaldisplay={isupdatemodalvisible}
          setIsmodaldisplay={setIsupdatemodalvisible}
        />
      )}
    </div>
  );
}

export default UsersView;
