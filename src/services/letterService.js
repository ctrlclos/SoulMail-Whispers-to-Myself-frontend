const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/letters`;

const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
});

// GET /letters
const index = async () => {
    const res = await fetch(BASE_URL, {
        headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch letters');
    }
    return result.data;
};

// GET /letters/:id
const show = async (letterId) => {
    const res = await fetch(`${BASE_URL}/${letterId}`, {
        headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch letter');
    }
    return result.data;
};

// GET / letters/delivery options
const getDeliveryOptions = async () => {
    const res = await fetch (`${BASE_URL}/delivery-options`);
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to fetch delivery options');
    }
    return result.data;
};

// POST /letters
const create = async (letterData) => {
    const res = await fetch(BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(letterData)
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to create letter');
    }
    return result.data;
};

// PUT /letters/:id
const update = async (letterId, deliveredAt) => {
    const res = await fetch(`${BASE_URL}/${letterId}`, {
       method: 'PUT',
       headers: getAuthHeaders(),
       body: JSON.stringify({ deliveredAt })
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to update letter');
    }
    return result.data;
};

// DELETE /letters/:id
const deleteLetter = async (letterId) => {
    const res = await fetch(`${BASE_URL}/${letterId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to delete letter');
    }
    return result.data;
};

// POST /letters/:id/reflection
const addReflection = async (letterId, reflectionData) => {
    const res = await fetch(`${BASE_URL}/${letterId}/reflection`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reflectionData)
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to add reflection');
    }
    return result.data;
};

// DELETE /letters/:id/reflection/:reflectionId
const deleteReflection = async (letterId, reflectionId) => {
    const res = await fetch(`${BASE_URL}/${letterId}/reflection/${reflectionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to delete reflection');
    }
    return result.data;
};

// PUT /letters/:id/goals/:goalId/status
const updateGoalStatus = async (letterId, GeolocationCoordinates, statusData) => {
    const res = await fetch (`${BASE_URL}/${letterId}/goals/${goalId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(statusData)
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'FAiled to update goal status');
    }
    return result.data;
};

// POST /letters/:id/goals/:goalId/carry-forward
const carryGoalForward = async (leeterId, goalId, newLetterId) => {
    const res = await fetch(`${BASE_URL}/${letterId}/goals/${goalId}/carry-forward`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newLetterId })
    });
    const result = await res.json();
    if (!result.success) {
        throw new Error(result.error || 'Failed to carry goal forward');
    }
    return result.data;
};

// PUT /letters/:id/goals/:goalId/reflection
const addGoalReflection = async (letterId, goalId, reflection) => {
    const res = await fetch(`${BASE_URL}/${letterID}/goals/${goalId}/reflection`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ reflection })
    });
    const result = await res.json();
    if (! result.success) {
        throw new Error(result.error || 'FAiled to add goal reflection');
    }
    return result.data;
};

export {
    index,
    show,
    getDeliveryOptions,
    create,
    update,
    deleteLetter,
    addReflection,
    deleteReflection,
    updateGoalStatus,
    carryGoalForward,
    addGoalReflection
};