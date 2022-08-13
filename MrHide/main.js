if(typeof window['MrHide'] !== 'function'){
    window.MrHide = class  {
        static username=window.location.hostname.split('.')[0];

        static toString(){
            console.log('username:',this.username);
        }

    }
}
