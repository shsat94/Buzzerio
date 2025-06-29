export const checkIsGuest = async ( host, apiKey) => {

    const res = await fetch(`${host}/${apiKey}/member/isguest`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const response = await res.json();
    return response.guest;

  };


  export const deleteGuestUser = async ( host, apiKey) => {
    const res = await fetch(`${host}/${apiKey}/member/deleteguest`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        "auth-token": localStorage.getItem('token')
      }
    });
    const response = await res.json();

  };
  
