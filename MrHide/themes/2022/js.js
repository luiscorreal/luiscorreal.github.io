MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav class="main">',item,url;
        for (item in this.layouts['page']) {
            url=item;
            item=this.layouts['page'][item];
            ret+=`<a href='${this.root+'/'+url+'.html'}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    header(){
        return `<header>${this.builders.build('pagesNavbar')}</header>`;
    }
})
