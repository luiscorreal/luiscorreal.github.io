MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav class="main">',item,url,current;
        for (item in this.layouts['page']) {
            url=item;
            item=this.layouts['page'][item];
            current=(url==this.file.url)?'class="current" ':''
            ret+=`<a ${current} href='${this.root+'/'+url}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    userProfile(){
        return `<div class='user-profile'>
            <div><img src='${this.user.avatar_url}'></div>
            <div>
                <h2>${this.user.name}</h2>
                <span><i class="fa-solid fa-location-dot"></i> ${this.user.location}</span>
                <a href='${this.user.html_url}'>
                    <i class="fa-brands fa-github" title="GitHub"></i>
                    <span>GitHub profile</span>
                </a>
                <a href='${this.user.blog}'>
                    <i class="fa-solid fa-earth-americas"></i>
                    <span>${this.user.blog}</span>
                </a>
                <a href='https://twitter.com/${this.user.twitter_username}'>
                    <i class="fa-brands fa-twitter"></i>
                    <span>@${this.user.twitter_username}</span></a>
                <p>${this.user.bio}</p>
            </div>
        </div>`
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
