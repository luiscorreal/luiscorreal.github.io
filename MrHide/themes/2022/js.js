MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav>',item;
        for (item in this.layouts['page']) {
            item=this.layouts['page'][item];
            console.log(item)
            ret+=`<a href='${item.url}'>${item.title}</a>`;
        }
        return ret+'</nav>';
    },

    head(){
        return `<head>
            <h1>Here the title</h1>
        </head>`;
    }
})
