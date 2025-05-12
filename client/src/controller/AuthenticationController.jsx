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
        console.error("Login failed:", response);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  }