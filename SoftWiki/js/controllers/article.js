import { createArticle as apiCreateArticle, getArticleById as apiGetArticleById, deleteArticle as apiDeleteArticle, getArticleById, updateArticle as apiUpdateArticle } from '../data.js'
export async function create() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }
    await this.partial('./templates/articles/create.hbs', this.app.userData)
    if (!this.app.userData.loggedIn) {
        document.querySelector('.home').href = '#/login'
    } else {
        document.querySelector('.home').href = '#/home'
    }
}

export async function createNewArticle() {
    try {
        if (this.params.title === '' || this.params.category === '' || this.params.content === '') {
            alert('All article fields are required!');
            return;
        }
        const newArticle = {
            title: this.params.title,
            category: this.params.category,
            content: this.params.content,
            creatorEmail: localStorage.getItem('email')
        }

        const result = await apiCreateArticle(newArticle);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        if (result.category.toLowerCase() === 'javascript') {
            this.app.userData.jsPosts.push(result);
            this.app.userData.jsPosts = this.app.userData.jsPosts.sort((postA, postB) => { postB.title.localeCompare(postA.title) });
        } else if (result.category.toLowerCase() === 'c#') {
            this.app.userData.cSharpPosts.push(result);
            this.app.userData.cSharpPosts = this.app.userData.cSharpPosts.sort((postA, postB) => { postB.title.localeCompare(postA.title) });
        } else if (result.category.toLowerCase() === 'java') {
            this.app.userData.javaPosts.push(result);
            this.app.userData.javaPosts = this.app.userData.javaPosts.sort((postA, postB) => { postB.title.localeCompare(postA.title) });
        } else if (result.category.toLowerCase() === 'python') {
            this.app.userData.pythonPosts.push(result);
            this.app.userData.pythonPosts = this.app.userData.pythonPosts.sort((postA, postB) => { postB.title.localeCompare(postA.title) });
        }

        alert('Successfully created new post')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}

export async function edit() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }
    const article = await getArticleById(this.params.id);
    const context = Object.assign({article}, this.app.userData)
    console.log(article);
    await this.partial('./templates/articles/edit.hbs', context)
    if (!this.app.userData.loggedIn) {
        document.querySelector('.home').href = '#/login'
    } else {
        document.querySelector('.home').href = '#/home'
    }
}

export async function editArticle(){
    const articleId = this.params.id;
    try {
        if(this.params.title.trim() === '' || this.params.category.trim() === '' || this.params.content.trim()=== ''){
            throw new Error('All input fields are required!');
        }

        const oldArticle = await getArticleById(this.params.id);

        const updatedArticle = {
            title: this.params.title,
            category: this.params.category,
            content: this.params.content
        }
    
        const result = await apiUpdateArticle(articleId, updatedArticle);
        if(result.hasOwnProperty('errorData')){
            const error = new Error();
            Object.assign(error, result);
            throw error
        }

        let oldSection = undefined;
        if (oldArticle.category.toLowerCase() === 'java') {
            oldSection = 'javaPosts'
        } else if (oldArticle.category.toLowerCase() === 'javascript') {
            oldSection = 'jsPosts'
        } else if (oldArticle.category.toLowerCase() === 'c#') {
            oldSection = 'cSharpPosts'
        } else if (oldArticle.category.toLowerCase() === 'python') {
            oldSection = 'pythonPosts'
        }
        
        if (oldSection !== undefined) {
            for (let i = 0; i < this.app.userData[oldSection].length; i++) {
                const currPost = this.app.userData[oldSection][i];
                if (currPost.objectId === this.params.id) {
                    this.app.userData[oldSection].splice(i, 1);
                }
            }
        }
        let newSection = undefined;
        if (result.category.toLowerCase() === 'java') {
            newSection = 'javaPosts'
        } else if (result.category.toLowerCase() === 'javascript') {
            newSection = 'jsPosts'
        } else if (result.category.toLowerCase() === 'c#') {
            newSection = 'cSharpPosts'
        } else if (result.category.toLowerCase() === 'python') {
            newSection = 'pythonPosts'
        }
        
        if (newSection !== undefined) {
            this.app.userData[newSection].push(result);
            this.app.userData[newSection] = this.app.userData[newSection].sort((postA,postB) => {postB.title.localeCompare(postA.title)})
        }
        alert('Article edited!')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}

export async function deleteArticle() {
    try {
        if (!confirm('Are you sure you want to delete the post?')) {
            return this.redirect('#/home');
        }
        const article = await getArticleById(this.params.id);

        const result = await apiDeleteArticle(this.params.id);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        let section = undefined;
        if (article.category.toLowerCase() === 'java') {
            section = 'javaPosts'
        } else if (article.category.toLowerCase() === 'javascript') {
            section = 'jsPosts'
        } else if (article.category.toLowerCase() === 'c#') {
            section = 'cSharpPosts'
        } else if (article.category.toLowerCase() === 'python') {
            section = 'pythonPosts'
        }
        if (section !== undefined) {
            for (let i = 0; i < this.app.userData[section].length; i++) {
                const currPost = this.app.userData[section][i];
                if (currPost.objectId === this.params.id) {
                    this.app.userData[section].splice(i, 1);
                }
            }
        }

        alert('Successfully deleted post')
        this.redirect('#/home')
    } catch (err) {
        alert(err.message)
    }
}

export async function postDetails() {
    this.partials = {
        header: await this.load('./templates/common/header.hbs'),
        footer: await this.load('./templates/common/footer.hbs')
    }
    try {
        const result = await apiGetArticleById(this.params.id);
        if (result.hasOwnProperty('errorData')) {
            const error = new Error();
            Object.assign(error, result);
            throw error
        }
        const context = Object.assign({ article: result }, this.app.userData)
        await this.partial('./templates/articles/details.hbs', context)
        alert('Successfully got article details')
    } catch (err) {
        alert(err.message)
    }
    if (!this.app.userData.loggedIn) {
        document.querySelector('.home').href = '#/login'
    } else {
        document.querySelector('.home').href = '#/home'
    }
}
