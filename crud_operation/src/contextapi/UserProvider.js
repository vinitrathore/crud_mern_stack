// src/context/UserProvider.js
import React, { useState } from "react";
import { UserContext } from "./CreateContext";

const UserProvider = ({ children }) => {
  const [users,
    setUsers,] = useState([]);
    const [searchResults, setSearchResults] = useState([]);

  const [isdataRefresh, setIsdataRefresh] = useState(false);
  const [isnewUserAdded, setIsnewUserAdded] = useState(false);

  const value = {
    users,
    setUsers,
    isdataRefresh,
    setIsdataRefresh,
    isnewUserAdded, setIsnewUserAdded,
    searchResults, setSearchResults
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
