
import {createEvent as apiCreateEvent, getEventById, updateEvent as apiEditEvent, deleteEvent as apiDeleteEvent} from '../data.js'
import {showError, showSuccess} from '../notification.js'

export async function create(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }
    this.partial('./templates/event/create.hbs', this.app.userData)
}
export async function createEvent() {
    try {
        if (this.params.name.length < 6) {
            showError('Event name should be at least 6 characters long');
            return;
        }
        if (this.params.description.length < 10) {
            showError('Description should be at least 10 characters long');
            return;
        }
        if (!this.params.imageURL.includes('http://') && !this.params.imageURL.includes('https://')) {
            showError('Invalid picture');
            return;
        }
        const newEvent = {
            name: this.params.name,
            eventDate: this.params.dateTime,
            description: this.params.description,
            image: this.params.imageURL,
            organizer: localStorage.getItem('username')
        }
    
        const result = await apiCreateEvent(newEvent);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        // showSuccess('Successfully created new post')
        this.app.userData.events.push(result)
        this.app.userData.events = this.app.userData.events.sort((a,b) => Number(b.peopleInterested) - Number(a.peopleInterested))
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}

export async function details(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    }
    const eventId = this.params.id;
    let event = this.app.userData.events.find(event => event.objectId === eventId)
    if(event === undefined){
        event = await getEventById(eventId);
    }
    event.owned = event.organizer === this.app.userData.username;

    const context = Object.assign({event}, this.app.userData)
    // showSuccess('Successfully got event details')
    this.partial('./templates/event/details.hbs', context)
}

export async function userProfile(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
    }
    // showSuccess('Successfully got event details')
    this.partial('./templates/user/userProfile.hbs', this.app.userData)
}

export async function edit(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }
    try {
        let result = this.app.userData.events.find(post => post.objectId === this.params.id);
        if(result === undefined){
            result = await getEventById(this.params.id)
        }
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        const context = Object.assign({detailedEvent: result}, this.app.userData)
        
        this.partial('./templates/event/edit.hbs', context)
    } catch (err) {
        showError(err.message)
    }
}

export async function editEvent(){
    const postId = this.params.id;
    try {
        const newEvent = {
            name: this.params.name,
            eventDate: this.params.dateTime,
            description: this.params.description,
            image: this.params.imageURL,
            organizer: localStorage.getItem('username')
        }

        const result = await apiEditEvent(postId, newEvent);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }

        for (let i = 0; i < this.app.userData.events.length; i++) {
            const curr = this.app.userData.events[i];
            if(curr.objectId === postId){
                this.app.userData.events[i] = result;
            }
        }

        for (let i = 0; i < this.app.userData.myEvents.length; i++) {
            const curr = this.app.userData.myEvents[i];
            if(curr.objectId === postId){
                this.app.userData.myEvents[i] = result;
            }
        }
        // showInfo('Successfully edited post')
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}

export async function joinEvent(){
    const postId = this.params.id;
    try {
        const currentEvent = await getEventById(postId);
        const updatedEvent = {
            peopleInterested: Number(currentEvent.peopleInterested) + 1
        }

        const result = await apiEditEvent(postId, updatedEvent);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }

        for (let i = 0; i < this.app.userData.events.length; i++) {
            const curr = this.app.userData.events[i];
            if(curr.objectId === postId){
                this.app.userData.events[i] = result;
            }
        }

        for (let i = 0; i < this.app.userData.myEvents.length; i++) {
            const curr = this.app.userData.myEvents[i];
            if(curr.objectId === postId){
                this.app.userData.myEvents[i] = result;
            }
        }
        this.app.userData.events = this.app.userData.events.sort((a,b) => Number(b.peopleInterested) - Number(a.peopleInterested))
        // showInfo('Successfully edited post')
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}

export async function deleteEvent(){
    try {
        if(!confirm('Are you sure you want to delete the post?')){
            return this.redirect('#/home');
        }

        const result = await apiDeleteEvent(this.params.id);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        for (let i = 0; i < this.app.userData.events.length; i++) {
            const currPost = this.app.userData.events[i];
            if(currPost.objectId === this.params.id){
                this.app.userData.events.splice(i, 1);
            }
        }
        this.app.userData.events = this.app.userData.events.sort((a,b) => Number(b.peopleInterested) - Number(a.peopleInterested))
        for (let i = 0; i < this.app.userData.myEvents.length; i++) {
            const curr = this.app.userData.myEvents[i];
            if(curr.objectId === this.params.id){
                this.app.userData.myEvents.splice(i, 1);
            }
        }
        
        // showInfo('Successfully deleted post')
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}