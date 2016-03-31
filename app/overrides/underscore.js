import _ from 'underscore'

_.mixin({
   offset: function (arr, offset, length) {
       var newArr = [];

       for (var i = offset; i < offset + length; i++) {
           if(!arr[i]) break;

           newArr.push(arr[i]);
       }

       return newArr;
   }
});