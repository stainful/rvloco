export default url =>
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
        },
    });
