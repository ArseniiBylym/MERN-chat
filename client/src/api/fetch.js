import {BASE_URI} from './config';

export const sendFile = file => {
    const token = localStorage.getItem('userToken');
    const formData = new FormData();
    formData.append('file', file);
    return fetch(`${BASE_URI}/images`, {
        method: 'POST',
        headers: new Headers({Authorization: `Bearer ${token}`}),
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(data => {
            return data.fileName;
        })
        .catch(error => {
            console.log(error);
        });
};
