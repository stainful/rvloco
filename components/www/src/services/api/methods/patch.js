export default (url, { data }) =>
    fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    });
