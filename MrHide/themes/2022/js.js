MrHide.builders=Object.assign(MrHide.builders,{
    pagesNavbar(){
        var ret='<nav>';
        ['perro','gato'].forEach((item, i) => {
            ret+=`<a href='#'>${item}</a>`;
        });
        return ret+'</nav>';
    },

    head(){
        return `<head>
            <h1>Here the title</h1>
        </head>`;
    }
})
