MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav class="main">',item,url;
        for (item in this.layouts['page']) {
            url=item;
            item=this.layouts['page'][item];
            ret+=`<a href='${this.root+'/'+url}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    header(){
        return `<header>
            <a href='${this.root}'>${this.settings.title || this.username}</a>
            ${this.builders.build('pagesNavbar')}
        </header>`;
    },

    articleHeader(type){
        return `<header class='article-header'>
            ${this.builders.build('categories')}
            ${this.builders.build('title')}
            ${this.builders.build('author')}
        </header>`;
    }
})
