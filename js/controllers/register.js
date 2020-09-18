import {register as apiRegister} from '../data.js'  
import {showSuccess, showError} from '../notification.js'

export default async function register(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        registerForm: await this.load('./templates/user/registerForm.hbs')
    }
    await this.partial('./templates/user/register.hbs')
    // document.querySelector('#successBox').addEventListener('click', hideSuccess)
    // document.querySelector('#errorBox').addEventListener('click', hideError)
}

export async function registerPost(){
    
    try {
        if(this.params.password !== this.params.rePassword){
            throw new Error('Passwords don\'t match!');
        }
    
        if(this.params.username.length < 3){
            throw new Error('Username must be at least 3 characters long');
        }
    
        if(this.params.password.length < 6){
            throw new Error('Password must be at least 6 characters long');
        }
        const result = await apiRegister(this.params.username, this.params.password);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        showSuccess('User registration successful')
        setTimeout(()=>{
            this.redirect('#/home')
        }, 5000)
    } catch (err) {
        showError(err.message)
    }
}