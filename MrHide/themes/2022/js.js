MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        console.log(this.layouts);
        var ret='<nav>';
        this.layouts['page'].forEach((item, i) => {
            ret+=`<a href='${item.url}'>${item.title}</a>`;
        });
        return ret+'</nav>';
    },

    head(){
        return `<head>
            <h1>Here the title</h1>
        </head>`;
    }
})
