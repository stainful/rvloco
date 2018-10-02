export default async url => {
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            Accept: 'application/json',
        },
    });
    return await response.json();
}
