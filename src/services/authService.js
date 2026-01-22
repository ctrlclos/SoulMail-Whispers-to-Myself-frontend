const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    // Handle both formats: {token: "..."} and {success: true, token: "..."}
    const token = data.token || (data.data && data.data.token);

    if (token) {
      localStorage.setItem('token', token);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      // Extract payload if it exists, otherwise use decoded directly
      return decoded.payload || decoded;
    }

    throw new Error('Invalid response from server');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

const signIn = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    // Handle both formats: {token: "..."} and {success: true, token: "..."}
    const token = data.token || (data.data && data.data.token);

    if (token) {
      localStorage.setItem('token', token);
      const decoded = JSON.parse(atob(token.split('.')[1]));
      // Extract payload if it exists, otherwise use decoded directly
      return decoded.payload || decoded;
    }

    throw new Error('Invalid response from server');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { signUp, signIn };