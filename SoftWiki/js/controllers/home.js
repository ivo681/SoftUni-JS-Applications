export default async function(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        article: await this.load('./templates/articles/article.hbs')
    }
    await this.partial('./templates/home.hbs', this.app.userData)

    if(!this.app.userData.loggedIn){
        document.querySelector('.home').href = '#/login'
    } else{
        document.querySelector('.home').href = '#/home'
    }
}