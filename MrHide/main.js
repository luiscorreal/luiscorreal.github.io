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
                    src:this.settings.themeUrl+'js.js'
                }));
                // theme style css
                document.head.appendChild(Object.assign(document.createElement('link'),{
                    rel:"stylesheet",
                    href:this.settings.themeUrl+'css.css'
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

        static builders={//into these functions 'this' refers to MrHide object
            layout(l){this.settings.theme=l;return '';}
            contents(){return this.contents;},
            user(field){
                switch(field){
                    case 'name':return 'hey';break;
                }
            }
        }

        static processContents(url){
            return fetch(url).then(data=>data.text()).then(contents=>{
                var regex=/<<(.+)>>/g,parts;

                const newContents = contents.replace(regex, (match, $1) => {
                    parts=$1.split(':');parts[1]=(parts[1]===undefined)?[]:parts[1].toString().split(',');
                    console.log(parts)
                    if (this.builders.hasOwnProperty(parts[0])) {
                        return this.builders[parts[0]].apply(this,parts[1]);
                    }else{
                        return 'error:no builder function:'+parts[0];
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
