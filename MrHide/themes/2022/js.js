MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav class="main">',item;
        for (item in this.layouts['page']) {
            item=this.layouts['page'][item];
            console.log(item)
            ret+=`<a href='${this.root+'/'+item.url+'.html'}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    header(){
        return `<head>
            ${this.builders.build('pagesNavbar')}
        </head>`;
    }
})
