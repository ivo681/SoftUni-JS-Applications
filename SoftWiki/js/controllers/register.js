import {register as apiRegister} from '../data.js'
export default async function(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        registerForm: await this.load('./templates/user/registerForm.hbs')
    }
    await this.partial('./templates/user/register.hbs', this.app.userData)

    if(!this.app.userData.loggedIn){
        document.querySelector('.home').href = '#/login'
    } else{
        document.querySelector('.home').href = '#/home'
    }
}

export async function registerPost(){
    try {
        if(this.params.email.trim() === '' || this.params.password.trim()=== '' || this.params['rep-pass'].trim() === ''){
            throw new Error('No empty fields are allowed!');
        }
        if(this.params.password !== this.params['rep-pass']){
            throw new Error('Passwords don\'t match!');
        }
    
        if(this.params.email.length < 3){
            throw new Error('Email address is invalid');
        }
    
        if(this.params.password.length < 3){
            throw new Error('Password must be at least 3 characters long');
        }

        const result = await apiRegister(this.params.email, this.params.password);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        alert('Successfully registered')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}