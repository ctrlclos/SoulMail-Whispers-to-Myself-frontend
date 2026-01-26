const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getAuthHeaders = () => ({
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
});

// GET /users
const index = async () => {
  try {
const res = await fetch(BASE_URL, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    console.log(data);
    if (data.err) {
      throw new Error(data.err);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// GET /users/profile
const getProfile = async () => {
  try {
    const res = await fetch (`${BASE_URL}/profile`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (data.err || !data.success) {
       throw new Error(data.err || data.error || 'Failed to fetch profile');
    }
    return data.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// PUT /users/profile
const updateProfile = async (profileData) => {
  try {
    const res = await fetch (`$(BASE_URL)/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (data.err || data.success) {
      throw new Error(data.err || data.error || 'Failed to update profile');
    }
    return data.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

// PUT /users/settings
const updateSettings = async (settings) => {
  try {
    const res = await fetch(`${BASE_URL}/settings`, {
      method:'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ settings })
    });
    const data = await res.json();
    if (data.err || !data.success) {
      throw new Error(data.err || data.error || 'Failed to update settings');
    }
    return data.data;
  } catch (err) {
    console.log(err);
    throw new AggregateError(err);
  }
};

const getStats = async () => {
  try {
    const res = await fetch(`${BASE_URL}/stats`, {
      hesders: getAuthHeaders()
    });
    const data = await res.json();
    if (data.err || !data.success) {
      throw new Error(data.err || data.error || 'Failed to fetch stats'); 
    }
    return data.data;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};


export { index,
  getProfile,
  updateProfile,
  updateSettings,
  getStats
 };