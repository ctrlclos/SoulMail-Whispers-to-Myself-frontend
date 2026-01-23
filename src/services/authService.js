const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/auth`;

const signUp = async (formData) => {
  try {
    const res = await fetch(`${BASE_URL}/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!data.success) {
      throw new Error(data.error || 'Sign up failed');
    }

    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
      return JSON.parse(atob(data.data.token.split('.')[1])).payload;
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

    if (!data.success) {
      throw new Error(data.error || 'Sign in failed');
    }

    if (data.data?.token) {
      localStorage.setItem('token', data.data.token);
      return JSON.parse(atob(data.data.token.split('.')[1])).payload;
    }

    throw new Error('Invalid response from server');
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export { signUp, signIn };