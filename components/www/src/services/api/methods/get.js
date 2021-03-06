export default async url => {
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
        },
    });
    return await response.json();
}
