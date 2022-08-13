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
                this.settings=data;

                if(slashsplit.length===2){//is page
                    this.file=this.type;
                    this.type='page';
                }

                this.settings.themeUrl=this.root+'/MrHide/themes/'+this.settings.theme+'/';

                //theme logic js
                document.head.appendChild(Object.assign(document.createElement('script'),{
                    type:"text/javascript",
                    onload(){
                        MrHide.process();
                    },
                    src:this.settings.themeUrl+'/js.js'
                }));
            })
        }

        static process(){
            //file
            this.processContents(`${this.root}/MrHide/${this.type}s/${this.file}.html`).then(html=>{
                this.contents=html;
                //layout
                this.processContents(this.settings.themeUrl+'layouts/'+this.type+'.html').then(contents=>{
                    document.body.innerHTML=contents;
                })
            })
        }

        static builders={
            contents(){return this.contents;},
            user(field){
                switch(field){
                    case 'name':return 'hey';break;
                }
            }
        }

        static processContents(url){
            return fetch(url).then(data=>data.text()).then(contents=>{
                var regex=/<<(.+)(\(.+\))?>>/g;
                const newContents = contents.replace(regex, (match, $1) => {
                    if (this.builders.hasOwnProperty($1)) {
                        return this.builders[$1].apply(this);
                    }else{
                        return 'error:no builder function:'+$1;
                    }
                });
                return newContents;
            })
        }
    }


    window.addEventListener('load',function(evt){
        MrHide.build();
    });

}
