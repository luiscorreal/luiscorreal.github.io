if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username;
        static root;//url well formed
        static type;//the layout file
        static file;
        static contents='';
        static settings;
        static layouts={
            add(name,url){
                if(name===''){
                    return Promise.resolve({});
                }else if(this.hasOwnProperty('name')){
                    return Promise.resolve(this[name]);
                }else{
                    return fetch(url).then(json=>json.json()).then(json=>{
                        this[name]=json;
                        return json;
                    });
                }
            }
        };

        static build(){
            var slashsplit=window.location.pathname.split('/');

            this.username=window.location.hostname.split('.')[0];
            this.root='https://'+window.location.hostname;
            this.layout=slashsplit[1];
            this.file=slashsplit[2];

            //pages
            this.layouts.add('page',this.root+'/MrHide/pages/list.json').then(pages=>{

                //settings
                fetch(this.root+'/MrHide/settings.json').then(data=>data.json()).then(data=>{
                    //set default settings
                    this.settings=Object.assign({
                        showErrors:false
                    },data);

                    if(slashsplit.length===2){//is page
                        this.file=this.layout;
                        this.layout='page';
                    }

                    if(this.file===''){//is index page
                        this.file='index';
                        this.layout=''
                    }

                    //open specfic layout sources check if file exists
                    this.layouts.add(this.layout,this.root+'/MrHide/'+this.layout+'s/list.json').then(pages=>{
                        if (this.file==='index' && this.layout===''){//index
                            this.file={url:'index',title:'xxx'};
                        }else{
                            if (!this.pages.hasOwnProperty(this.file)){//check if ressource does not exists
                                this.file={url:'404',title:'404'};
                                this.type='page';
                            }else{
                                this.file={
                                    url:this.file,
                                    ... this.pages[this.file]
                                };
                            }
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

                    });


                })
            })
        }



        static process(){
            //file
            this.processContents(`${this.root}/MrHide/${this.layout}s/${this.file.url}.html`).then(html=>{
                this.contents=html;

                if(this.layout!==''){
                    //layout
                    this.processContents(this.settings.themeUrl+'layouts/'+this.layout+'.html').then(contents=>{
                        document.body.innerHTML=contents;
                    })
                }else{
                    document.body.innerHTML=html
                }

            })
        }

        static builders={//into these functions 'this' refers to MrHide object
            layout(l){
                this.layout=l;
                return '';
            },

            featuredImage(){
                return `<img src=${this.root}/MrHide/assets/${this.file.image}' >`;
            },

            contents(){
                return this.contents;
            },

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

                    if (this.builders.hasOwnProperty(parts[0])) {
                        return this.builders[parts[0]].apply(this,parts[1]);
                    }else{
                        if(this.settings.showErrors){
                            return 'error: No builder function: '+parts[0];
                        }else{
                            return '';
                        }

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
