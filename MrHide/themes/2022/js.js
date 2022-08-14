MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav class="main">',item,url,current;
        for (item in this.layouts['page']) {
            url=item;
            item=this.layouts['page'][item];
            current=(item.url==this.file)?'class="current" ':''
            //console.log()
            ret+=`<a ${current} href='${this.root+'/'+url}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    userProfile(){
        return 'Here will be my GitHub profile.';
    },

    header(){
        return `<header class='main'>
            <a href='${this.root}' class='logo-home'><img src='${this.user.avatar_url}'> ${this.user.name}</a>
            ${this.builders.build('pagesNavbar')}
        </header>`;
    },

    articleHeader(type){
        return `<header class='article-header'>
            ${this.builders.build('categories')}
            ${this.builders.build('title')}
            ${this.builders.build('author')}
        </header>`;
    },

    footer(){
        return `<footer>Copyright ${this.builders.build('date',['year'])} © ${this.user.login}. All rights reserved.</footer>`;
    }
})
