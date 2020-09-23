/*globals Sammy*/
import home from './controllers/home.js'
import login, {loginPost} from './controllers/login.js'
import register,{registerPost} from './controllers/register.js'
import logout from './controllers/logout.js'
import {create, createNewArticle, postDetails, deleteArticle, edit, editArticle} from './controllers/article.js'
window.addEventListener('load', ()=>{
    const app = Sammy('#root', function(){
        this.use('Handlebars', 'hbs');

        this.userData = {
            email: localStorage.getItem('email') || '',
            userId: localStorage.getItem('userId') || '',
            jsPosts: [],
            cSharpPosts: [],
            javaPosts: [],
            pythonPosts: [],
            loggedIn: false
        }

        
        this.get('index.html', home);
        this.get('#/home', home);
        this.get('/', home);
        this.get('#/login', login)
        this.get('#/register', register)
        this.get('#/logout', logout);
        this.get('#/create', create);
        this.get('#/details/:id', ctx =>{postDetails.call(ctx)})
        this.get('#/delete/:id',deleteArticle )
        this.get('#/edit/:id',edit )
        
        this.post('#/register', ctx => {registerPost.call(ctx)})
        this.post('#/login', ctx => {loginPost.call(ctx)})
        this.post('#/create', ctx => {createNewArticle.call(ctx)})
        this.post('#/edit/:id', ctx => {editArticle.call(ctx)})
        

    })

    app.run()

    
    
})