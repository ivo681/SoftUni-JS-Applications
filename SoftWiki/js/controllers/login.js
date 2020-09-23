import {login as apiLogin, getArticlesByOwner} from '../data.js'
export default async function(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        loginForm: await this.load('./templates/user/loginForm.hbs')
    }
    await this.partial('./templates/user/login.hbs', this.app.userData)

    if(!this.app.userData.loggedIn){
        document.querySelector('.home').href = '#/login'
    } else{
        document.querySelector('.home').href = '#/home'
    }
}


export async function loginPost(){
    try {
        if(this.params.email.length < 3){
            throw new Error('Email address is invalid!');
        }
    
        if(this.params.password.length < 3){
            throw new Error('Password must be at least 3 characters long');
        }

        const result = await apiLogin(this.params.email, this.params.password);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        this.app.userData.loggedIn = true;
        this.app.userData.email = localStorage.getItem('email');
        this.app.userData.userId = localStorage.getItem('userId');
        const allArticles = await getArticlesByOwner();
        if(allArticles.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, userPosts);
            throw error;
        }
        this.app.userData.javaPosts = allArticles.filter(post => post.category.toLowerCase() === 'java').sort((postA,postB) => {postB.title.localeCompare(postA.title)})
        this.app.userData.jsPosts = allArticles.filter(post => post.category.toLowerCase() === 'javascript').sort((postA,postB) => {postB.title.localeCompare(postA.title)})
        this.app.userData.cSharpPosts = allArticles.filter(post => post.category.toLowerCase() === 'c#').sort((postA,postB) => {postB.title.localeCompare(postA.title)})
        this.app.userData.pythonPosts = allArticles.filter(post => post.category.toLowerCase() === 'python').sort((postA,postB) => {postB.title.localeCompare(postA.title)})
        alert('Successfully logged in')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}