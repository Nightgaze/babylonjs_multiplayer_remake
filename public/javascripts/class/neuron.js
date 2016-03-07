function Neuron(numInput){
    var weights = [];
    var lr = 0.1;
    var epochs = 1;

    for (var i=0; i<=numInput; i++)
        //weights.push(Math.random());
        weights.push(0);
    
    function m_Activate(x){
        return 1/(1 + Math.exp(Math.E, -x));    
        //return (x>0.5)?1:0;
    }

 
    
    return {
               train: function(input, output)   //input = [[1, 2, 9, 11,  1], [2, 3, 10, 20, 1], ...] output = [0.5, 1, 0.2, ...]
               {     
                   for (var e = 0; e<epochs; e++){                                         
                    var sum = 0, res = 0, err = 0;
                    for (var i=0; i<input.length; i++)
                    {
                        for (var j = 0; j<numInput; j++ )
                            sum += input[i][j] * weights[j];
                        res = m_Activate(sum);
                        err = output[i] - res;
                        //console.log('expected: ' + output[i] + ' obtained: ' + res + ' error: ' + err);

                        //update weights
                        /*console.log('before: ');
                         for (var j=0; j<weights.length; j++){
                             console.log(weights[i]); 
                            
                         } */

                         //console.log('after: ');
                        for (var j=0; j<weights.length; j++){
                             weights[i]+=err * input[i][j] * lr; 
                             //console.log(weights[i]);
                            
                         }  
                        //console.log('\n\n')
                    } 
                  }   
                 },
                 predict: function(input)
                 {
                    var sum = 0;
                    for (var j = 0; j<numInput; j++ )
                            sum += input[j] * weights[j];
                        res = m_Activate(sum);
                        return res;   
                 },
                 showWeights : function(){
                    for (var i=0; i<weights.length; i++)
                        console.log(weights[i]);    
                 }   
         }
}