if(typeof window['MinGHAPI'] !== 'function'){//Minimalist GitHub API
    window.MinGHAPI = class{
        static API='https://api.github.com';

        static user(user){
            return fetch(this.API+'/users/'+user).
            then(owner=>owner.json()).
            then(owner=>{
                return owner;
            })
        }

        static repoCommit(user,repo,path){
            return fetch(`${this.API}/repos/${user}/${repo}/commits?path=${encodeURI(path)}&page=1&per_page=1`)
            .then(response => response.json())
            .then(data => {
                return data[0].commit;
            });
        }

        static repoCommits(user,repo){
            return fetch(`${this.API}/repos/${user}/${repo}/commits`)
            .then(response => response.json())
            .then(data => {
                return data;
            });
        }

        static repoRefs(user,repo){
            return fetch(`${this.API}/repos/${user}/${repo}/git/refs`)
            .then(response => response.json())
            .then(data => {
                return data[0];
            });
        }

        //https://api.github.com/repos/leduardocorreal/SimplestWebComponent/git/trees/d77aff3d00dc4db9d04ea4bb32ba4854d191cb24
        static tree(user,repo,sha){
            return fetch(`${this.API}/repos/${user}/${repo}/git/trees/${sha}`)
            .then(response => response.json())
            .then(data => {
                return data.tree;
            });
        }

        static treeFromUrl(url){
            return fetch(url)
            .then(response => response.json())
            .then(data => {
                return data.tree;
            });
        }

        //https://raw.githubusercontent.com/${this.data.ownerLogin}/${this.data.repoName}/main/${this.data.url}`;
        static blob(user,repo,blobName){
            return fetch(`https://raw.githubusercontent.com/${user}/${repo}/main/${blobName}`)
            .then(response => {
                return response;
            });
        }


        static decodeBlobB64(url){
            fetch(url)
            .then(data=>data.json())
            .then(data=>{
                /*if(data.encoding==="base64"){
                    console.log(decodeURIComponent(escape(window.atob(data.content))))
                    return decodeURIComponent(escape(window.atob(data.content)));
                }*/
                return 'cuuuuuu';
            })
        }
    }
}


if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static user;
        static root;//url well formed
        static type;//the layout file
        static file;
        static contents='';
        static settings;
        static layouts={
            add(name,url,sort=true){
                if(name===''){
                    return Promise.resolve({});
                }else if(this.hasOwnProperty('name')){
                    return Promise.resolve(this[name]);
                }else{
                    return fetch(url).then(json=>json.json()).then(json=>{
                        if(Array.isArray(json) && sort){
                            json.sort((a, b)=> {
                                var c = new Date(a.date);
                                var d = new Date(b.date);
                                return d-c;
                            });
                        }
                        this[name]=json;
                        return json;
                    });
                }
            }
        };

        static build(){
            MinGHAPI.user(window.location.hostname.split('.')[0]).then(user=>{
                this.user=user;
                //console.log(this.user.name)
                var slashsplit=window.location.pathname.split('/');
                //this.user=window.location.hostname.split('.')[0];
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
                            this.layout='page'
                        }

                        //open specfic layout sources check if file exists
                        this.layouts.add(this.layout,this.root+'/MrHide/'+this.layout+'s/list.json').then(pages=>{
                            if (this.file==='index' && this.layout==='page'){//index
                                this.file={url:'index',title:this.user.name};
                            }else{
                                if (!this.layouts[this.layout].hasOwnProperty(this.file)){//check if ressource does not exists
                                    this.file={url:'404',title:'404'};
                                    this.type='page';
                                }else{
                                    this.file={
                                        url:this.file,
                                        ... this.layouts[this.layout][this.file]
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
                            //font awesome
                            document.head.appendChild(Object.assign(document.createElement('link'),{
                                rel:"stylesheet",
                                href:'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css'
                            }));
                            // theme style css
                            document.head.appendChild(Object.assign(document.createElement('link'),{
                                rel:"stylesheet",
                                href:this.settings.themeUrl+'css.css'
                            }));

                        });


                    })
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
            build(name,attrs=[]){
                return this[name].apply(MrHide,attrs);
            },

            error(message,argument){
                return `<div class='MrHide-error'><b>Error:</b> ${message} (${argument})</div>`;
            },

            layout(l){
                this.layout=l;
                return '';
            },

            date(field){
                var d=new Date();
                switch(field){
                    case 'year':return d.getFullYear();break;
                }
            },

            featuredImage(){
                if(this.file.image !== undefined && this.file.image !==''){
                    return `<img class='featured-image' src='${this.root}/MrHide/assets/${this.file.image}' >`;
                }else{
                    return '';
                }
            },

            author(){
                if(this.file.author !== undefined){
                    if(this.file.author === '')this.file.author=this.user.login;
                    return `<div>By <b class='author'>${this.file.author}</b> - ${this.file.date}</div>`;
                }else{
                    return '';
                }
            },

            title(){
                return `<h1>${this.file.title}</h1>`;
            },

            /*categories(){
                if(this.file.categories !== undefined){
                    var ret='<nav class="categories">';
                    this.file.categories.forEach((item, i) => {
                        ret+=`<span>${item}</span>`;
                    });
                    ret+='</nav>';
                    return ret;
                }else{
                    return '';
                }
            },*/

            contents(){
                return `<article>${this.contents}</article>`;
            },

            user(field){
                return this.user[field];
            },

            categories(cats,wrap=['<span>','</span>']){
                return "<nav class='categories'>"+cats.map(cat => wrap[0]+cat+wrap[1]).toString()+"</nav>";
            },

            previewList(list,start=0,count=4){
                this.layouts.add('post',this.root+'/MrHide/'+list+'s/list.json').then(items=>{
                    var ret='';
                    items.forEach((item,i) => {
                        if(i<start)return;
                        if(i>start+count)return;

                        var cat=''
                        if(item.categories!==[]){

                        }

                        ret+=`<section class='preview-item ${list}-preview-item'>
                            <a href='${this.root+'/'+list+'s/'+item.url}'>
                                <img src='${this.root+'/MrHide/assets/'+item.image}'>
                                ${this.builder.build('categories')}
                                <h3>${item.title}</h3>
                                <b><i class="fa-solid fa-calendar"></i> <span>${item.date}</span></b>
                                <p>${item.summary}</p>
                            </a>
                        </section>`
                    });
                    document.querySelector('div.'+list+'-preview-list').innerHTML=ret;
                })
                return '<div class="preview-list '+list+'-preview-list"></div>';
            },

            sectionHeading(text,url=''){
                var b=(url==='')?'':`<a href='${url}>See all</a>'`
                return `<h2 class='section-heading'><span>${text}</span>${b}<hr></h2>`
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
                            return this.builders.error('No builder function:',parts[0]);
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
