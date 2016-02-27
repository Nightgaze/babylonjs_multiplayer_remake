
function List(){
    var root = {_id: 'root'}, cursor = {_id: 'cursor'};
    cursor = root;
    cursor.next = null;
    return {
        GetRoot: function(){
            return root;
        },
        Push: function (node){
            var prev = cursor;
            cursor.next = node;
            cursor = cursor.next;
            cursor.prev = prev;
            cursor.next = null;
        },
        Search: function (name){
            var p = root;
            while ((p._id != name) && (p.next != null)) {
                p = p.next;
            }
            if (p._id == name){
               return p;
               console.log('Item was found!');
            }
            else {
                 console.log("Item wasn't found!");
                 }
        },
        Delete: function (name){
            var p = root;
            var prec;
            while ((p._id != name) && (p.next != null)) {
                prec = p;
                p = p.next;
            }
            if (p._id == name) {
                prec.next = p.next;
                if (p.next) p.next.prev = prec;
                delete p;
                console.log('Item was deleted!');
            }
            else {
                 console.log("Item wasn't found!");
                 }
        },
        /*Sort: function (){
            var sort = false
            while (!sort) {
                sort = true;
                while (p.next != null) {
                p = p.next;
                if (p.next.name.co )
                }
            }
        }*/
        Show: function (){
            var p = root;
            var res = [];
            while (p.next != null) {
                p = p.next;
                res.push(p._id);
            }
            console.log(res);
        }
        

     

    
    }
    
}