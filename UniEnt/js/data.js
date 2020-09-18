function host(endpoint) {
    return 'https://api.backendless.com/4DE9562E-5259-7014-FF4E-2F6748EBAF00/3AD33049-E89B-4108-9C63-B6156E59F3A0/' + endpoint;
}

const endpoints = {
    REGISTER: "users/register",
    LOGIN: "users/login",
    LOGOUT: "users/logout",
    EVENTS: "data/events",
    EVENT_BY_ID: "data/events/"
}

export async function register(username, password){
    const result = (await fetch(host(endpoints.REGISTER), {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({username, password})
    })).json();
    return result;
}

export async function login(username, password){
    const result = await (await fetch(host(endpoints.LOGIN), {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({login: username, password})
    })).json();

    localStorage.setItem('userToken', result['user-token'])
    localStorage.setItem('username', result.username)
    localStorage.setItem('userId', result.objectId)
    // this.app.userData.loggedIn = true;
    return result;
}

export async function logout(){
    const token = localStorage.getItem('userToken');
    localStorage.removeItem('userToken');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    const result = await fetch(host(endpoints.LOGOUT), {
        headers: {
            'user-token': token
        }
    })
    // this.app.userData.loggedIn = false;
    return result;
}

export async function createEvent(event){
    const token = localStorage.getItem('userToken');
    const result = (await fetch(host(endpoints.EVENTS), {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(event)
    })).json();
    return result;
}

export async function updateEvent(id, updatedEvent){
    const token = localStorage.getItem('userToken');
    const result = (await fetch(host(endpoints.EVENT_BY_ID + id), {
        method: "PUT",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
        body: JSON.stringify(updatedEvent)
    })).json();
    return result;
}

export async function deleteEvent(id){
    const token = localStorage.getItem('userToken');
    const result = (await fetch(host(endpoints.EVENT_BY_ID + id), {
        method: "DELETE",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
    })).json();
    return result;
}

export async function getAllEvents(){
    const token = localStorage.getItem('userToken');
    const result = (await fetch(host(endpoints.EVENTS), {
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
    })).json();
    return result;
}

export async function getEventById(id){
    const token = localStorage.getItem('userToken');
    const result = (await fetch(host(endpoints.EVENT_BY_ID + id), {
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
    })).json();
    return result;
}

export async function getEventsByOwner(){
    const token = localStorage.getItem('userToken');
    const ownerId = localStorage.getItem('userId')
    const result = (await fetch(host(endpoints.EVENTS + `?where=ownerId%3D%27${ownerId}%27`), {
        method: "GET",
        headers:{
            "Content-Type": "application/json",
            "user-token": token
        },
    })).json();
    return result;
}

