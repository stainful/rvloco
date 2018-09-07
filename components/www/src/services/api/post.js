export default (url, { data }) =>
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(data),
    });
