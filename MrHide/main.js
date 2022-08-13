if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username=window.location.hostname.split('.')[0];
        static meta=window.location.pathname.split('/')[1];
        static file=window.location.pathname.split('/')[2];

        static build(){
            console.log(this);
        }

    }

    window.addEventListener('load',function(evt){
        MrHide.build();
    });

}
