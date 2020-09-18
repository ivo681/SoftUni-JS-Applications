export default async function(){
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs'),
        event: await this.load('./templates/event/event.hbs')
    }
    this.partial('./templates/home.hbs', this.app.userData)
}