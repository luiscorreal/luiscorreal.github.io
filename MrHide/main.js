if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username;
        static root;//url well formed
        static type;
        static file;
        static contents='';
        static settings;

        static build(){
            var slashsplit=window.location.pathname.split('/');

            this.username=window.location.hostname.split('.')[0];
            this.root='https://'+window.location.hostname;
            this.type=slashsplit[1];
            this.file=slashsplit[2];

            //settings
            fetch(this.root+'/MrHide/settings.json').then(data=>data.json()).then(data=>{
                //set default settings
                this.settings=Object.assign({
                    "theme":""
                },data);

                if(slashsplit.length===2){//is page
                    this.file=this.type;
                    this.type='page';
                }

                this.process();
            })
        }

        static process(){
            //file
            fetch(`${this.root}/MrHide/${this.type}s/${this.file}.html`).then(data=>data.text()).then(html=>{
                this.contents=html;

                if(this.settings.theme===''){
                    this.setContents();
                }else{
                    this.settings.themeUrl=this.root+'/MrHide/themes/'+this.settings.theme+'/';
                    this.processContents(this.settings.themeUrl+'layouts/'+this.type+'.html').then(contents=>{
                        this.setContents();
                    })
                }

            })
        }

        static property(name){
            switch(name){
                case 'contents':return this.contents;break;
                default: '';
            }
        }

        static processContents(url){
            return fetch(url).then(data=>data.text()).then(contents=>{
                var regex=/{{this::(.+)}}/g;

                const newContents = contents.replace(regex, (match, $1) => {
                  return this.property($1);
                });

                return newContents;
            })
        }

        static setContents(){
            document.body.html=this.contents;
        }

    }

    window.addEventListener('load',function(evt){
        MrHide.build();
    });

}
