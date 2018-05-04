const getAuthHeader = () => {
    const token = '';

    if (!token) return {};

    return {
        Authorization: token,
    };
};

export const post = (url, body, options = {}) => {
    return fetch(url, {
        ...options,
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(body),
        headers: {
            ...getAuthHeader(),
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            ...options.headers,
        },
    });
}

export const get = (url, options = {}) => {
    return fetch(url, { ...options })
      .then(response => response.json());
};