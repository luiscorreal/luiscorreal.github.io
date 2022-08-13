if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username;
        static root;//url well formed
        static type;
        static file;
        static contents='';
        static layoutContents='';
        static settings;

        static includesUrl;
        static files={};

        /*static getIncludes(text){
            var regex=/{{include::(.+)}}/g,result,ret=[];

            while(result = regex.exec(text)) {
              if(this.files.hasOwnProperty(name)===false && !ret.includes(result[1])){
                  ret.push(result[1]);
              }
            }

            return ret;
        }

        static openFile(name,url){
            if(this.files.hasOwnProperty(name)===false){
                Object.defineProperty(this.files, name, {value: ''});

                return fetch(url).then(data=>data.text()).then(contents=>{
                    Object.defineProperty(this.files, name, {value: contents});
                    var incs=getIncludes(contents);

                    if(incs.length>0){
                        Promise.all(urls.map(url =>
                            fetch(url).then(resp => resp.text())
                        )).then(texts => {
                            …
                        })
                    }else{
                        return true;
                    }
                });
            }else{
                return false;
            }
        }*/

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
            fetch(`${this.root}/MrHide/${this.type}s/${this.file}.html`).then(data=>data.text()).then(html=>{
                this.contents=html;

                //layout
                this.processContents(this.settings.themeUrl+'layouts/'+this.type+'.html').then(contents=>{
                    this.layoutContents=contents;
                    this.html(contents);
                })


            })
        }

        static builders={
            contents(){return MrHide.contents;}
        }

        static processContents(url){
            return fetch(url).then(data=>data.text()).then(contents=>{
                console.log(contents)
                var regex=/<<(.+)(\(.+\))?>>/g;
                const newContents = contents.replace(regex, (match, $1) => {
                    if (this.buildres.hasOwnProperty($1)) {
                        console.log($1);
                      }

                    return this.builders[$1]();
                });
            })
        }

        static html(contents){
            document.body.innerHTML=contents;
        }

    }

    window.addEventListener('load',function(evt){
        MrHide.build();
    });

}
