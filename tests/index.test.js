const axios2 = require('axios');

const API_URL = 'http://locahost:3000/';

const axios = {
    post: async (...args) => {
    try {
        const res = await axios2.post(...args);
        return res;
    } catch (e) {
        return e.response;
    }
    },
    get: async (...args) => {
    try {
        const res = await axios2.get(...args);
        return res;
    } catch (e) {
        return e.response;
    }
    },
    put: async (...args) => {
    try {
        const res = await axios2.put(...args);
        return res;
    } catch (e) {
        return e.response;
    }
    },
    delete: async (...args) => {
    try {
        const res = await axios2.delete(...args);
        return res;
    } catch (e) {
        return e.response;
    }
    },
};

describe('User Creation and Authentication', () => {

    test('User Sign Up Successful', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        const response = await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(200)
    })

    test('User Already Exists', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(403);
    })

    test('Invalid Input', async () => {
        const username = `orca${Math.random()}`;
        const password = '123212312';

        const response = await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(400);
    })

    // User SignIn Test Cases
    test('User Sign In Successful', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    })

    test("User doesn't exist", () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        const response = axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(404);
    });
    
    test('Wrong Password', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password: '12341241'
        })

        expect(response.statusCode).toBe(401);
    });
})

describe('User metadata endpoints', () => {
    let token = "";
    let avatarId = "";

    beforeAll(async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        token = response.data.token;
    });

    test('')
})