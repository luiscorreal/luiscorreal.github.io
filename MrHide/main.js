if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username;
        static base;
        static meta;
        static file;

        static build(){
            var slashsplit=window.location.pathname.split('/');

            this.username=window.location.hostname.split('.')[0];
            this.base='https://'+window.location.hostname;
            this.meta=slashsplit[1];
            this.file=slashsplit[2];

            if(slashsplit.length===2){//is page
                this.file=this.meta;
                this.base+='/MrHide/pages/';
                fetch(this.base+this.file+'.html').then(data=>data.text()).then(html=>{
                    this.html(`<h1>${this.file}</h1>`+html)
                })

            }else{//is meta type(post,...)
                switch(this.meta){
                    case 'post':this.post();break;
                }
            }


        }

        static html(contents=''){
            document.body.innerHTML+=contents;
        }

        static page(){
            this.html()
        }

        static post(){
            this.html()
        }

    }

    window.addEventListener('load',function(evt){
        MrHide.build();
    });

}
