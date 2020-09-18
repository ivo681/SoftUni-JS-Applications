import {logout as apiLogout} from '../data.js'
import {showSuccess, showError} from '../notification.js'

export default async function logout(){
    try {
        if(!confirm('Are you sure you want to logout?')){
            return this.redirect('#/home');
        }

        const result = await apiLogout();
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        this.app.userData.username = '';
        this.app.userData.userId = '';
        this.app.userData.loggedIn = false;
        this.app.userData.events = [];
        
        showSuccess('Logout successful')
        this.redirect('#/home')
    } catch (err) {
        showError(err.message)
    }
}