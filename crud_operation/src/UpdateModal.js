import React, { useContext, useEffect, useState } from 'react';
import { FaSave } from "react-icons/fa";
import { RiCloseLargeFill } from "react-icons/ri";
import { api_url } from './constansts/apiUrl';
import { UserContext } from './contextapi/CreateContext';
import Toast from './Toast';
function UpdateModel({ id, ismodaldisplay, setIsmodaldisplay }) {
  const {isdataRefresh,
    setIsdataRefresh} = useContext(UserContext);
  const [name, setName] = useState('');
  // const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  const showToast = (msg, type) => {
    setToast({ message: msg, type });
  };
  useEffect(() => {
    if (id) {
      fetch(`${api_url}/${id}`)
        .then(res => res.json())
        .then(data => {
          setName(data.name);
          setEmail(data.email);
          setPhone(data.phone);
        })
        .catch(err => console.error("Error fetching user:", err));
    }
  }, [id]);
  
  // 🧠 Validation function
  const validate = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // if (!username.trim()) {
    //   newErrors.username = "Username is required.";
    // } else if (!/^[a-zA-Z0-9]+$/.test(username.trim())) {
    //   newErrors.username = "Username must be alphanumeric.";
    // } else if (username.trim().length < 3) {
    //   newErrors.username = "Username must be at least 3 characters.";
    // }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(phone.trim())) {
      newErrors.phone = "Phone number must be 10 digits.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const saveapicalling = async () => {
    try {
      const res = await fetch(`${api_url}/${id}`, {
        method: "PUT", // ✅ Use PUT or PATCH for update
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, email })
      });
  
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
  
      const data = await res.json();
      console.log("✅ User updated:", data);
      setIsdataRefresh((prev)=>!prev);
      // setTimeout(() => {
      //   setIsdataRefresh(false);
      // }, 1000);
      // showToast('User update sucessfully', 'success')
    } catch (err) {
      console.error("❌ Error updating user:", err.message);
    }
  };
  

  // const saveapicalling = async () => {
  //   try {
  //     const res = await fetch(`${api_url}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ name, phone, email })
  //     });
  
  //     if (!res.ok) throw new Error(`Server error: ${res.status}`);
  
  //     const data = await res.json();
  //     console.log("✅ User saved:", data);
  //   } catch (err) {
  //     console.error("❌ Error saving user:", err.message);
  //   }
  // };
  
  
  // 💾 Save button handler
  // const handleSave = () => {
  //   if (validate()) {
  //     console.log("Form is valid. Saving...");
  //     saveapicalling();
  //     setIsmodaldisplay(false);
  //   } else {
  //     console.log("Form has errors.");
  //   }
  // };
  const handleSave = async () => {
    if (validate()) {
      console.log("Form is valid. Saving...");
      
      await saveapicalling();   // wait for API call to finish
      
      showToast('User updated successfully', 'success');  // show toast
      
      // Delay modal close to let toast be visible
      setTimeout(() => {
        setIsmodaldisplay(false);
      }, 1500); // 1.5 seconds delay
    } else {
      console.log("Form has errors.");
    }
  };
  
  const handleInputChange = (field, value) => {
    let updatedErrors = { ...errors };
  
    // Set the value
    if (field === 'name') {
      setName(value);
      if (!value.trim()) {
        updatedErrors.name = "Name is required.";
      } else if (value.trim().length < 2) {
        updatedErrors.name = "Name must be at least 2 characters.";
      } else {
        delete updatedErrors.name;
      }
    }
  
    // if (field === 'username') {
    //   setUsername(value);
    //   if (!value.trim()) {
    //     updatedErrors.username = "Username is required.";
    //   } else if (!/^[a-zA-Z0-9]+$/.test(value.trim())) {
    //     updatedErrors.username = "Username must be alphanumeric.";
    //   } else if (value.trim().length < 3) {
    //     updatedErrors.username = "Username must be at least 3 characters.";
    //   } else {
    //     delete updatedErrors.username;
    //   }
    // }
  
    if (field === 'email') {
      setEmail(value);
      if (!value.trim()) {
        updatedErrors.email = "Email is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        updatedErrors.email = "Invalid email format.";
      } else {
        delete updatedErrors.email;
      }
    }
  
    if (field === 'phone') {
      setPhone(value);
      if (!value.trim()) {
        updatedErrors.phone = "Phone number is required.";
      } else if (!/^\d{10}$/.test(value.trim())) {
        updatedErrors.phone = "Phone number must be 10 digits.";
      } else {
        delete updatedErrors.phone;
      }
    }
  
    // Set errors after validation
    setErrors(updatedErrors);
  };
  
  // 🎯 Input change handler that also clears errors as user types
  // const handleInputChange = (field, value) => {
  //   // Set the value
  //   if (field === 'name') setName(value);
  //   if (field === 'username') setUsername(value);
  //   if (field === 'email') setEmail(value);
  //   if (field === 'phone') setPhone(value);

  //   // Clear the error for that field
  //   setErrors(prev => ({ ...prev, [field]: '' }));
  // };

  return (
    <div style={modalStyle}>
      <RiCloseLargeFill
        style={{ position: "relative", left: "320px", top: "0px", cursor: "pointer" ,fontWeight:"bolder"}}
        size={24}
        onClick={() => setIsmodaldisplay(false)}
      />

      <div><h1>Update User</h1></div>

      <div style={{ display: "flex", flexDirection: "column", width: "90%" }}>
        {/* Name */}
        <input
          type='text'
          placeholder='Enter user name'
          style={inputStyle}
          value={name}
          onChange={(e) => handleInputChange('name', e.target.value)}
        />
        {errors.name && <span style={errorStyle}>{errors.name}</span>}

        {/* Username */}
        {/* <input
          type='text'
          placeholder='Enter username'
          style={inputStyle}
          value={username}
          onChange={(e) => handleInputChange('username', e.target.value)}
        />
        {errors.username && <span style={errorStyle}>{errors.username}</span>} */}

        {/* Email */}
        <input
          type='email'
          placeholder='Enter email'
          style={inputStyle}
          value={email}
          onChange={(e) => handleInputChange('email', e.target.value)}
        />
        {errors.email && <span style={errorStyle}>{errors.email}</span>}

        {/* Phone */}
        <input
          type='text'
          placeholder='Enter phone number'
          style={inputStyle}
          value={phone}
          // onChange={(e) => handleInputChange('phone', e.target.value)}
          onChange={(e) => {
            const val = e.target.value;
            if (/^\d*$/.test(val) && val.length <= 10) {  // digits only, max length 10
              handleInputChange('phone', val);
            }
          }}
        />
        {errors.phone && <span style={errorStyle}>{errors.phone}</span>}
      </div>

      <div style={footerStyle}>
        <button onClick={handleSave} style={buttonStyle}>
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>Save</p>
          <FaSave size={24} />
        </button>
      </div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

    </div>
  );
}

export default UpdateModel;
const modalStyle = {
  // backgroundColor: "gray",
  backgroundColor:"rgb(230 233 235)",

  display: "flex",
  flexDirection: "column",
  height: "370px",
  width: "700px",
  alignItems: "center",
  justifyContent: "space-evenly",
  border: "1px solid gray",
  borderRadius: "5px",
  position: "fixed",
  left: "470px",
  top: "180px",
  padding: "20px",
  zIndex:"999"
};

const inputStyle = {
  margin: "10px",
  height: "45px",
  borderRadius: "8px",
  border: "none",
  paddingLeft: "10px"
};

const errorStyle = {
  color: "black",
  fontSize: "12px",
  marginLeft: "10px",
  marginTop: "-8px"
};

const buttonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  border: "1.5px solid gray",
  borderRadius: "5px",
  marginLeft: "40px",
  width: "100px",
  backgroundColor: "#fff",
  cursor: "pointer"
};

const footerStyle = {
  width: "100%",
  height: "50px",
  display: "flex",
  alignSelf: "flex-start"
};
