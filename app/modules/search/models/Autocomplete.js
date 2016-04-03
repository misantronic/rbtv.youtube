import {Model, Collection} from 'backbone'

let autocompleteDefaults = [
    { title: '#MoinMoin', expr: /^#{0,1}moi/i, playlistId: 'PLsksxTH4pR3KZe3wbmAP2Tgn6rfhbDlBH' },
    { title: 'Kino Plus', expr: /^kino/i, playlistId: 'PLsksxTH4pR3KtrWWeupRy5h0Di7N_MufB' },
    { title: 'Bohn Jour', expr: /^boh/i, playlistId: 'PLsksxTH4pR3Kxtqnu9Ht8b2XB_HGUYVJ1' },
    { title: 'Almost Daily', expr: /^almost/i, playlistId: 'PLsksxTH4pR3I6-7OYZ0GigNnc7KI5S0OK' },
    { title: 'Almost Plaily', expr: /^almost/i, playlistId: 'PLsksxTH4pR3Ly_8f3RTw6MU_2Eg-2xMNA' },
    { title: 'Game Plus', expr: /^game/i, playlistId: 'PLsksxTH4pR3K4w-99v-cmC5NSqPbAGjTz' },
    { title: 'Pen & Paper: T.E.A.R.S.', expr: /^pen/i, playlistId: 'PLsksxTH4pR3I3cY9vXrygdSqavv_U_0oZ' },
    { title: 'Pen & Paper: B.E.A.R.D.S.', expr: /^pen/i, playlistId: 'PLsksxTH4pR3Kk6Uz2NCG4QAjhKy4y8T5' },
    { title: 'Panelz', expr: /^panel/i, playlistId: 'PLsksxTH4pR3I8ImSEa98WCr73iu3vjpn4' },
    { title: 'Chat Duell', expr: /^chat/i, playlistId: 'PLsksxTH4pR3JFM4GKuRmWpIgxl5QcMwO0' },
    { title: 'TheraThiel', expr: /^th{0,1}er+a/i, playlistId: 'PLsksxTH4pR3J1z9gC0kp9l7TfwSCSjCfe' },
    { title: 'Bohndesliga', expr: /^bohn|fu(ss|ß)ball/i, playlistId: 'PLsksxTH4pR3IDcHQVTbGpfEdNexUFy_pb' },
    { title: 'Spiele mit Bart', expr: /^spiele|bart/i, playlistId: 'PLsksxTH4pR3Ilo0vc3S5owjkmUV6XtH6T' },
    { title: 'RBTV News', expr: /^news|rbtv/i, playlistId: 'PLsksxTH4pR3JVqDJW3C92GaX_mEwiAAKK' },
    { title: 'Nerd Quiz S01', expr: /^nerd/i, playlistId: 'PLsksxTH4pR3J9TYKS2-UrSvwrU1jUfU2y' },
    { title: 'Nerd Quiz S02', expr: /^nerd/i, playlistId: 'PLsksxTH4pR3LQKx_i3iTwmmfCP8z9uIk5' }
];

class AutocompleteItem extends Model {
    defaults() {
        return {
            title: null,
            search: new RegExp(),
            playlistId: null
        }
    }
}

class Autocomplete extends Collection {
    constructor(...args) {
        super(...args);

        this.model = AutocompleteItem;

        this._originalModels = this.models;

        this.search();
    }

    search(val) {
        if(val) {
            this.reset(
                _.filter(this._originalModels, (model) => {
                    return model.get('expr').test(val)
                })
            );
        } else {
            this.reset();
        }
    }
}

export {AutocompleteItem, Autocomplete, autocompleteDefaults}
export default Autocomplete