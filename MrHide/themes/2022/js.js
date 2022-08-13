MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav>';
        /*this.layouts['page'].forEach((item, i) => {
            ret+=`<a href='${item.url}'>${item.title}</a>`;
        });*/
        for (const item in this.layouts['page']) {
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
