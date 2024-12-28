import axios from "axios";
import Cookies from "js-cookie";

const client = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

client.interceptors.request.use(
    (client) => {
        const token = Cookies.get('token');
        if (token && typeof token === 'string') {
            client.headers.Authorization = `Bearer ${token}`;
        } else {
            delete client.headers.Authorization;
        }

        return client;
    },
    (error) => Promise.resolve(error)
);

client.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 403 && !originalRequest._retry) {
            originalRequest._retry = true;
            setTimeout(() => {
                window.location.reload()
            }, 2000)
            Cookies.remove('token');
            return Promise.reject(error);
        }

        return Promise.reject(error);
    }
);

export default client;