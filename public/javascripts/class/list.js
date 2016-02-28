
function List(){
    var public = {};
    var root = null, cursor;
    
        public.GetRoot = function(){
            return root;
        }
        public.Search = function (name){
            if (root){
                var p = root;
                while ((p._id != name) && (p.next != null)) {
                    p = p.next;
                }
                if (p._id == name)
                    return p;
                else return false;
            }
            else return false;
        }
        public.Push = function (node){
            if (!public.Search(node._id))
                if (!root) {
                    root=node;
                    cursor = root;
                    return true;
                    }
                else {
                    cursor.next = node;
                    cursor = cursor.next;
                    cursor.next = null;
                    return true;
                }
            else return false;
        }
        public.Delete = function (name){
            var p = root;
            var prec;
            while ((p._id != name) && (p.next != null)) {
                prec = p;
                p = p.next;
            }
            if (p._id == name)
            { 
                if (p==root){
                    if (p.next == null){
                        p.dispose();
                        delete p;
                        root = null;
                    }
                    else {
                        root = p.next;
                        p.dispose();
                        delete p;
                        cursor = root;
                    }
                } else { 
                    prec.next = p.next;
                    if (p.next) cursor = p.next 
                    else cursor = prec;

                    p.dispose();
                    delete p;
                    return; 
                }
            }
            else return false;
        }
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
        public.Show = function (){
            var p = root;
            var res = [];
            while (p) {
                res.push(p._id);
                p = p.next;               
            }
            console.log(res);
        }
        

     

    
    
    return public;
}