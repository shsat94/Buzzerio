export const sendOtp = async (cpEmail, host, apiKey, setOneTimePassword, setIsUserPresent) => {
  const res = await fetch(`${host}/${apiKey}/authentication/sendotptomail`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: cpEmail })
  });
  const response = await res.json();
  setOneTimePassword(response.generatedEmailOtp);
  setIsUserPresent(response.userisPresent);
};

export const signUp = async (cpEmail, password, personName, host, apiKey) => {
  const res = await fetch(`${host}/${apiKey}/authentication/signup`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ name: personName, email: cpEmail, password: password })
  });
  const response = await res.json();
  localStorage.setItem('token', response.authenticationToken);
};

export const login = async (email, password, host, apiKey) => {
  try {
    const res = await fetch(`${host}/${apiKey}/authentication/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    });

    const response = await res.json();

    // Check if request was successful (status 200)
    if (res.ok || response.status === 200) {
      localStorage.setItem('token', response.authenticationToken);
      return true;
    } else {
      // Handle error cases
      return false;
    }
  } catch (error) {
    return false;
  }
}

export const getUserDetails = async (host, apiKey) => {
  try {
    const res = await fetch(`${host}/${apiKey}/authentication/getuserdetail`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      },
    });

    const response = await res.json();
    return response.user;
   
  } catch (error) {
    return false;
  }
}

export const resetPassword = async (cpEmail, password, host, apiKey) => {
  const res = await fetch(`${host}/${apiKey}/authentication/resetpassword`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({email: cpEmail, password: password })
  });
  const response = await res.json();
  (response.execution);
  return response.execution;
};

// Add this function to your existing AuthenticationController.js

// Google Authentication function
export const googleAuth = async (credential, host, apiKey) => {
  try {
    const response = await fetch(`${host}/${apiKey}/authentication/google-auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        credential: credential
      })
    });

    const data = await response.json();
    
    if (data.execution && data.authenticationToken) {
      // Store the authentication token
      localStorage.setItem('token', data.authenticationToken);
      return {
        success: true,
        data: data,
        isNewUser: data.isNewUser,
        user: data.user
      };
    } else {
      throw new Error(data.error || 'Google authentication failed');
    }
  } catch (error) {
    throw new Error(error.message || 'Google authentication failed');
  }
};

// Link Google Account function (for existing users who want to add Google sign-in)
export const linkGoogleAccount = async (credential, host, apiKey) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('Please login first to link your Google account');
    }

    const response = await fetch(`${host}/${apiKey}/authentication/link-google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        credential: credential
      })
    });

    const data = await response.json();
    
    if (data.execution) {
      return {
        success: true,
        message: data.message,
        user: data.user
      };
    } else {
      throw new Error(data.error || 'Failed to link Google account');
    }
  } catch (error) {
    throw new Error(error.message || 'Failed to link Google account');
  }
};


export const signupGuest = async (personName, host, apiKey) => {
  const res = await fetch(`${host}/${apiKey}/authentication/guestSignup`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ name: personName })
  });
  console.log("resteer");
  if(res.status==200){
  const response = await res.json();
  localStorage.setItem('token', response.authenticationToken);
  return true;
  }
  return false;
};