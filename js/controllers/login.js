import { login as apiLogin, getAllEvents } from '../data.js'
import { showSuccess, showError } from '../notification.js'
export default async function () {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        loginForm: await this.load('./templates/user/loginForm.hbs')
    }
    await this.partial('./templates/user/login.hbs', this.app.userData)
}

export async function loginPost() {
    try {
        const result = await apiLogin(this.params.username, this.params.password);
        console.log(result);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        this.app.userData.username = result.username;
        this.app.userData.userId = result.objectId;
        this.app.userData.loggedIn = true;
        this.app.userData.events = await getAllEvents();
        this.app.userData.myEvents = this.app.userData.events.filter(event => event.organizer === this.app.userData.username);
        this.app.userData.events = this.app.userData.events.sort((a,b) => Number(b.peopleInterested) - Number(a.peopleInterested))
        showSuccess('Login successful');
        setTimeout(()=>{
            this.redirect('#/home')
        }, 5000)
    } catch (err) {
        showError(err.message)
    }
}