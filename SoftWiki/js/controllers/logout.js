import { logout as apiLogout } from '../data.js'
export default async function logout() {
    try {
        if (!confirm('Are you sure you want to logout?')) {
            return this.redirect('#/home');
        }

        const result = await apiLogout();
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        this.app.userData.loggedIn = false;
        this.app.userData.email = '';
        this.app.userData.userId = '';
        this.app.userData.cSharpPosts = [];
        this.app.userData.javaPosts = [];
        this.app.userData.jsPosts = [];
        this.app.userData.pythonPosts = [];

        alert('Successfully logged out')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}