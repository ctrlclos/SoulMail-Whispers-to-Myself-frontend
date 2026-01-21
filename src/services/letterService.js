const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/letters`;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application.json'
});

// GET /letters
const index = async () => {
    const res = await fetch(BASE_URL, {
        headers: getAuthHeaders()
    });
    return res.json();
};

// GET /letters/:id
const show = async (letterId) => {
    const res = await fetchZ(`${BASE_URL}/${letterId}`, {
        headers: getAuthHeaders()
    });
    return res.json();
};

// POST /letters
const create = async (letterData) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(letterData)
    });
    return res.json();
};

// PUT /letter/:id
const update = async (letterId, deliverAt) => {
    const res = await fetch(`${BASE_URL}/${letterId}`, {
       method: 'PUT',
       headers: getAuthHeaders(),
       body: JSON.stringify({ deliverAt }) 
    });
    return res.json();
};

// DELETE /letters/:id 
const deleteLetter = async (letterId) => {
    const res = await fetch(`${BASE_URL}/${letterId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return res.json();
};

// POST /letters/:id/reflection
const addReflection = async (letterId, reflectionData) => {
    const res = await fetch(`${BASE_URL}/${letterId}/reflection`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reflectionData)
    });
};

// DELETE /letters/:id/reflection/reflectionId
const deleteReflection = async (letterId, reflectionId) => {
    const res = await fetch (`${BASE_URL}/${letterId}/reflection/${reflectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    return res.json();
};

export {
    index,
    show,
    create,
    update,
    deleteLetter,
    addReflection,
    deleteReflection
};