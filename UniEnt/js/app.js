/*globals Sammy*/
import home from './controllers/home.js'
import login,{loginPost} from './controllers/login.js'
import logout from './controllers/logout.js'
import register, {registerPost} from './controllers/register.js'
import {create, createEvent, details, userProfile, edit, editEvent, joinEvent, deleteEvent} from './controllers/event.js'
window.addEventListener('load', ()=>{
    const app = Sammy('body', function(){
        this.use('Handlebars', 'hbs')

        this.userData = {
            username: localStorage.getItem('username') || '',
            userId: localStorage.getItem('userId') || '',
            events: [],
            myEvents: [],
            loggedIn: false,
        }

        this.get('index.html', home);
        this.get('/', home);
        this.get('#/home', home);
        this.get('#/login', login);
        this.get('#/register', register)
        this.get('#/logout', logout)
        this.get('#/create', create)
        this.get('#/details/:id', ctx =>{details.call(ctx)})
        this.get('#/:id', ctx =>{userProfile.call(ctx)})
        this.get('#/edit/:id', ctx =>{edit.call(ctx)})
        this.get('#/joinEvent/:id', ctx=> {joinEvent.call(ctx)})
        this.get('#/delete/:id', deleteEvent)


        this.post('#/edit/:id', ctx => {editEvent.call(ctx)})
        this.post('#/login', ctx => {loginPost.call(ctx);})
        this.post('#/register', ctx => {registerPost.call(ctx);})
        this.post('#/create', ctx => {createEvent.call(ctx);})


    })

    app.run()
})