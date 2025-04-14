import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { useState } from 'react';
import './SignUp.css';

function SignUp() {
    return (
        <div className="courses-page">
          <Header />
          < RegForm />
          <Footer />
        </div>
    );
}


function RegForm() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    


    const [username_feedback, setFeedbackUsername] = useState("");
    const [email_feedback, setFeedbackEmail] = useState("");
    const [password_feedback, setFeedbackPassword] = useState("");
    const [confirm_feedback, setFeedbackPasswordConfrim] = useState("");

    function verifyUsernameValiditity(e) {
        const newUsername = e.target.value;
        setUsername(newUsername);
        const lengthOK = newUsername.length >= 3 && newUsername.length <= 20;
        const startsWithLetter = /^[A-Za-z]/.test(newUsername);
        const validCharacters = /^[A-Za-z0-9-_]+$/.test(newUsername);
        const noSpaces = !/\s/.test(newUsername);

        if (lengthOK && startsWithLetter && validCharacters && noSpaces) {
            setFeedbackUsername("✅ Valid username");
        } else {
            setFeedbackUsername("❌ Username must be 3-20 characters long, start with a letter, and can only contain alphanumeric characters, hyphens (-), and underscores (_).");
        }
    }
    
    function verifyEmailValidity(e) {
        const newEmail = e.target.value;
        setEmail(newEmail);
        // Simple email regex for validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(newEmail)) {
            setFeedbackEmail("✅ Valid email");
        } else {
            setFeedbackEmail("❌ Invalid email format");
        }
    }

    function verifyPasswordEligibility(e) {
        const newPass = e.target.value;
        setPassword(newPass);
        // Simple password criteria:
        //Must be at least 8 characters long.
        //Must contain at least one uppercase letter, one lowercase letter, one number, and one special character.
        //Allowed special characters: !@#$%^&*()-_=+[]{}|;:'",.<>?/`~.
        //Cannot contain spaces.
        const lengthOK = newPass.length >= 8;
        const hasNumber = /\d/.test(newPass);
        const hasSpecialChar = /[!@#$%^&*(),.?\":{}|<>]/.test(newPass);

        const hasUppercase = /[A-Z]/.test(newPass);
        const hasLowercase = /[a-z]/.test(newPass);
        const noSpaces = !/\s/.test(newPass);

        if (lengthOK && hasNumber && hasSpecialChar && hasUppercase && hasLowercase && noSpaces) {
            setFeedbackPassword("✅ Strong password");
        } else {
            setFeedbackPassword("❌ Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, a special character, and must not contain spaces.");
        }
    }

    function verifyPasswordConfirm(e, updatedPassword = password) {
        const newConfirmPass = e.target.value;
        if (newConfirmPass !== updatedPassword) {
            setFeedbackPasswordConfrim("❌ Passwords do not match");
        } else {
            setFeedbackPasswordConfrim("✅ Passwords match");
        }
    }



    return (
        <div className="reg-form">
            <h2>Registration Form</h2>
            <form onSubmit={(e) => {
                e.preventDefault();
                if (
                    username_feedback === "✅ Valid username" &&
                    email_feedback === "✅ Valid email" &&
                    password_feedback === "✅ Strong password" &&
                    confirm_feedback === "✅ Passwords match"
                ) {
                    fetch("http://localhost:5000/register", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          username: username,
                          password: password,
                          email: email
                        })
                      })
                        .then(res => res.json())
                        .then(data => {
                            console.log(data);
                            if (data.success) {
                                alert("Registration successful!");
                            } else {
                                alert("Registration failed: " + data.message);
                            }
                        })
                        .catch(err => {
                            console.error("Error:", err);
                            alert("An error occurred during registration.");
                        });
                    
                } else {
                    alert("Please fix the errors in the form before submitting.");
                }
            }}>
                <div className="form-group">
                    <label htmlFor="name">Username:</label>
                    <input
                        type="text"
                        id="name"
                        name="username"
                        value={username}
                        onChange={verifyUsernameValiditity}/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={email}
                        onChange={verifyEmailValidity}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        value={password}
                        onChange={(e) => {
                            verifyPasswordEligibility(e);
                            const newPass = e.target.value;
                            setPassword(newPass); 
                            verifyPasswordConfirm({ target: { value: confirmPassword } }, newPass); 
                        }}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password:</label>
                    <input 
                        type="password" 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); verifyPasswordConfirm(e); }}
                    />
                </div>
                <button className="signup-button" type="submit">Register </button>
            </form>
            <div className="form-validation">
                <p className="error">{username_feedback}</p>
                <p className="error">{email_feedback}</p>
                <p className="error">{password_feedback}</p>
                <p className="error">{confirm_feedback}</p>
            </div>
        </div>
    );
}

export default SignUp;