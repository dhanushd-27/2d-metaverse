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

        expect(response.statusCode).toBe(200);
        expect(response.data.userId).toBeDefined();
    })

    test('User Already Exists', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        await axios.post(`${API_URL}api/v0/user/signup`, {
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

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        expect(response.statusCode).toBe(200);
        expect(response.body.token).toBeDefined();
    })

    test("User doesn't exist", async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(404);
    });
    
    test('Wrong Password', async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password: '12341241'
        })

        expect(response.statusCode).toBe(401);
    });
})

describe('User metadata endpoints', () => {
    let token = "";
    let avatarId = "";
    let userToken = "";

    beforeAll(async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        token = response.data.token;

        const avatarResponse = await axios.post(`${API_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://image.com/avatar1.png",
            name: "Timmy"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })

        avatarId = avatarResponse.data.avatarId;

        const userUsername = `orca${Math.random()}`;
        const userPassword = '@orca123';

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username: userUsername,
            password: userPassword,
            type: 'user'
        })

        const userResponse = await axios.post(`${API_URL}api/v0/user/signin`, {
            username: userUsername,
            password: userPassword
        })

        userToken = userResponse.data.token;
    });

    // Update Metadata
    test('User should be able to update metadata with valid avatar id', async () => {
        
        const response = await axios.post(`${API_URL}/api/v1/user/metadata`, {
            "avatarId": "123",
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(200);
    });

    test('User should not be able to update metadata without valid avatar id', async () => {
        const response = await axios.post(`${API_URL}/api/v1/user/metadata`, {
            "avatarId": "1235235232323",
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(400);
    })
    
    test("Unauthorised should not be able to update metadata if headers is not present", async () => {
        const response = await axios.post(`${API_URL}/api/v1/user/metadata`, {
            "avatarId": "1235235232323",
        })

        expect(response.statusCode).toBe(403);
    })
})

describe('User avatar Information', () => {
    let userId = "";
    let avatarId = "";

    beforeAll(async () => {
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        const response = await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        userId = response.data.userId;

        await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        const avatarResponse = await axios.post(`${API_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://image.com/avatar1.png",
            name: "Timmy"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        })

        avatarId = avatarResponse.data.avatarId;
    });

    test('Get back avatar information for a user', async () => {
        const response = await axios.get(`${API_URL}/api/v1/user/metadata/bulk?ids=[${userId}]`);
        expect(response.statusCode).toBe(200);
        expect(response.data.avatars[0].userId).toBe(userId);
    })
    
    test("Available avatars lists the recently created avater", async () => {
        const response = await axios.get(`${API_URL}/api/v1/avatars`);
        expect(response.data.avatars.length).not.toBe(0);
        const currAvatar = response.data.avatars.find(x => x.id == avatarId);
        expect(currAvatar).toBeDefined();
    });
})

describe('Space Dashboard', () => {
    let adminToken = "";
    let userToken = "";
    let elementId1 = "";
    let elementId2 = "";
    let mapId = "";

    beforeAll(async () => {

        // Create a user and sign in as Admin
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        // store the admin token to create elements and maps
        adminToken = response.data.token;

        // Create Two elements as admin
        const elementResponse1 = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        const elementResponse2 = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        // store element id's
        elementId1 = elementResponse1.data.id;
        elementId2 = elementResponse2.data.id;

        // Create a map using both the elements 1 and 2
        const mapResponse = await axios.post(`${API_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: elementId1,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                },
                {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        // store elements id's
        mapId = mapResponse.data.id;

        // Create user and signin
        const userUsername = `orca${Math.random()}`;
        const userPassword = '@orca123';

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username: userUsername,
            password: userPassword,
            type: 'user'
        })

        const userResponse = await axios.post(`${API_URL}api/v0/user/signin`, {
            username: userUsername,
            password: userPassword
        })

        // store usertoken
        userToken = userResponse.data.token;
    })

    // User to create a space
    test("User should be able to create a space with dimensions and mapId", async () => {

        const response = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        expect(response.statusCode).toBe(200);
        expect(response.body.spaceId).toBeDefined();
    });

    test("User should not be able to create a space without dimensions and mapId", async () => {

        const response = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        expect(response.statusCode).toBe(400);
    });

    // User to delete a space
    test("User should be able to delete a space which exists", async () => {
        const response = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        const spaceId = response.data.id;

        const deleteResponse = await axios.delete(`${API_URL}/api/v1/space/${spaceId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        expect(deleteResponse.statusCode).toBe(200);
    });

    test("User should not be able to delete a space which doesn't exists", async () => {
        const spaceId = "";

        const deleteResponse = await axios.delete(`${API_URL}/api/v1/space/${spaceId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        expect(deleteResponse.statusCode).toBe(400);
    });

    test("Unauthorised user should not be able to delete a space which is not created by them", async () => {
        const response = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        const spaceId = response.data.id;

        const deleteResponse = await axios.delete(`${API_URL}/api/v1/space/${spaceId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        expect(deleteResponse.statusCode).toBe(400);
    });

    // Get Existed Spaces
    test("No spaces are present intially", async () => {
        const response = await axios.get(`${API_URL}/api/v1/space/all`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
        });
        expect(response.data.spaces.length).toBe(0);
    });

    test("Get back all the existing spaces", async () => {
        const spaceCreationResponse = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        const spaceCreatedId = spaceCreationResponse.data.spaceId;

        const response = await axios.get(`${API_URL}/api/v1/space/all`, {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${adminToken}`,
        });

        expect(response.data.spaces.length).toBe(1);
        expect(response.data.spaces.find(x => x.id == spaceCreatedId)).toBeDefined();
    });
})

describe('Arena Tests', () => {
    let adminToken = "";
    let userToken = "";
    let elementId1 = "";
    let elementId2 = "";
    let mapId = "";
    let spaceId = "";

    beforeAll(async () => {

        // Create a user and sign in as Admin
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        // store the admin token to create elements and maps
        adminToken = response.data.token;

        // Create Two elements as admin
        const elementResponse1 = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        const elementResponse2 = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        // store element id's
        elementId1 = elementResponse1.data.id;
        elementId2 = elementResponse2.data.id;

        // Create a map using both the elements 1 and 2
        const mapResponse = await axios.post(`${API_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: elementId1,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                },
                {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        // store elements id's
        mapId = mapResponse.data.id;

        // Create user and signin
        const userUsername = `orca${Math.random()}`;
        const userPassword = '@orca123';

        await axios.post(`${API_URL}api/v0/user/signup`, {
            username: userUsername,
            password: userPassword,
            type: 'user'
        })

        const userResponse = await axios.post(`${API_URL}api/v0/user/signin`, {
            username: userUsername,
            password: userPassword
        })

        // store usertoken
        userToken = userResponse.data.token;

        const createSpaceResponse = await axios.post(`${API_URL}/api/v1/space`, {
            "name": "Test",
            "dimensions": "100x200",
            "mapId": mapId
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        spaceId = createSpaceResponse.data.spaceId;
    });

    test("Get Elements of a space when spaceId is provided", async () => {
        const response = await axios.get(`${API_URL}/api/v1/space/${spaceId}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(200);
        expect(response.data.dimensions).toBeDefined();
        expect(response.data.elements.length).toBe(3);
    });

    test("Return 400, When Space is not found", async () => {
        const response = await axios.get(`${API_URL}/api/v1/space/asgasdhwef`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(400);
    });

    test("Delete an element from the space", async () => {
        const response = await axios.get(`${API_URL}/api/v1/space/asgasdhwef`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        const elementId = response.data.elements[0].id;

        const deleteResponse = await axios.delete(`${API_URL}/api/v1/space/element`, {
            data: {
                spaceId: spaceId,
                elementId: elementId
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        expect(deleteResponse.statusCode).toBe(200);
        expect(response.data.elements.length).toBe(2);
    });

    test("Adding an element fails if dimensions is wrong", async () => {
        const response = await axios(`${API_URL}/api/v1/space/element`, {
            "elementId": elementId1,
            "spaceId": spaceId,
            "x": 1000,
            "y": 20000
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(400);
    })

    test("Adding an element successfully", async () => {
        const response = await axios(`${API_URL}/api/v1/space/element`, {
            "elementId": elementId1,
            "spaceId": spaceId,
            "x": 40,
            "y": 20
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(response.statusCode).toBe(200);
        expect(response.data.elements.length).toBe(3);
    })
})

describe('Admin Endpoints', () => {
    let adminToken = "";
    let userToken = "";
    let userId = "";
    let adminId = "";

    beforeAll(async () => {

        // Create a user and sign in as Admin
        const username = `orca${Math.random()}`;
        const password = '@orca123'

        const signUpResponse = await axios.post(`${API_URL}api/v0/user/signup`, {
            username,
            password,
            type: 'admin'
        })

        adminId = signUpResponse.data.id;

        const response = await axios.post(`${API_URL}api/v0/user/signin`, {
            username,
            password
        })

        // store the admin token to create elements and maps
        adminToken = response.data.token;

        // Create user and signin
        const userUsername = `orca${Math.random()}`;
        const userPassword = '@orca123';

        const userSignUpResponse = await axios.post(`${API_URL}api/v0/user/signup`, {
            username: userUsername,
            password: userPassword,
            type: 'user'
        })

        userId = userSignUpResponse.data.id;

        const userResponse = await axios.post(`${API_URL}api/v0/user/signin`, {
            username: userUsername,
            password: userPassword
        })

        // store usertoken
        userToken = userResponse.data.token;
    });

    test("A user should not be able to hit admin end points", async () => {
        const createElementResponse = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        });

        // Some Gibberish element id as authentication will fail before put request
        const updateElementResponse = await axios.put(`${API_URL}/api/v1/admin/element/gsdfgwegw`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        const createAvater = await axios.post(`${API_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://image.com/avatar1.png",
            name: "Timmy"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        const createMap = await axios.post(`${API_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: elementId1,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                },
                {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`,
            }
        })

        expect(createElementResponse.statusCode).toBe(403);
        expect(updateElementResponse.statusCode).toBe(403);
        expect(createAvater.statusCode).toBe(403);
        expect(createMap.statusCode).toBe(403);
    })

    test("An admin be able to hit admin end points", async () => {
        const createElementResponse = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        const createAvater = await axios.post(`${API_URL}/api/v1/admin/avatar`, {
            imageUrl: "https://image.com/avatar1.png",
            name: "Timmy"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        const createMap = await axios.post(`${API_URL}/api/v1/admin/map`, {
            "thumbnail": "https://thumbnail.com/a.png",
            "dimensions": "100x200",
            "name": "100 person interview room",
            "defaultElements": [{
                    elementId: elementId1,
                    x: 20,
                    y: 20
                }, {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                },
                {
                    elementId: elementId2,
                    x: 18,
                    y: 20
                }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        })

        expect(createElementResponse.statusCode).toBe(200);
        expect(updateElementResponse.statusCode).toBe(200);
        expect(createAvater.statusCode).toBe(200);
        expect(createMap.statusCode).toBe(200);
    })

    test("An Admin should be able to update an element", async () => {
        const elementResponse = await axios.post(`${API_URL}/api/v1/admin/element`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
            "width": 1,
            "height": 1,
            "static": true // weather or not the user can sit on top of this element (is it considered as a collission or not)
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        });

        const elementId = elementResponse.data.id;

        const updateElementResponse = await axios.put(`${API_URL}/api/v1/admin/element/${elementId}`, {
            "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE"
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`,
            }
        })
    })
})