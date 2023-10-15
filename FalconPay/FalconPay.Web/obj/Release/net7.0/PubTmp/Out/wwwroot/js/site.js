class Payment {
    constructor(refkey, amount, isSpl,tokenaddress,transferUrl,recipient) {
      this.refkey = refkey;
      this.amount = amount;
      this.status=false;
      this.tokenaddress=tokenaddress;
      this.isSpl=isSpl;
      this.pat=true;
      this.transferurl=transferUrl;
      this.signature="";
      this.recipient=recipient;
    }
}
(async function(){
    bindNumpad();
    
    document.getElementById('generate').onclick=async function(){

        const transferRequest= generatePayment();
        var qrCodeUrl="https://chart.apis.google.com/chart?cht=qr&chl="+transferRequest.transferurl+"&chs=400"
        document.getElementById("qrcode").setAttribute('src',qrCodeUrl);
         reqtokenname=document.getElementById('tokens').selectedOptions[0].innerText;
        document.getElementById('paymentResult').innerHTML=' Requested: <b>'+transferRequest.amount+' '+reqtokenname+ '</b><br>Status: <b>Pending Payment</b>';
    
        dataFetcher = new SmartInterval(
            async () => {
                await checkTransfer(transferRequest);
            },
            2000
        );
        dataFetcher.start();
    }
})();
function generatePayment(){
    var tokens_=document.getElementById('tokens');
  
    const is_spltoken=tokens_.selectedOptions[0].value=="sol"?false:true;
    const spl_address=tokens_.selectedOptions[0].value;
    const recipientWallet="8X5zHADZ4oTZXC59JmjVn1NRqcA6DGc649TrwL11ZdNr";
    const refKey=new solanaWeb3.Keypair().publicKey.toBase58();
    const requestedAmount=document.getElementById('tutar').value;
    var tranferUrl="solana:"+recipientWallet+"?amount="+requestedAmount+"%26reference="+refKey;
    if(is_spltoken){
      tranferUrl=tranferUrl+"%26spl-token="+spl_address;
    }
   
    var payment = new Payment(refKey,requestedAmount,is_spltoken,spl_address,tranferUrl,recipientWallet);
    return payment;
}

function bindNumpad(){
    var tuslar=document.getElementsByClassName('button');
    var toplam=document.getElementById('tutar');
    for(var i=0;i<tuslar.length;i++){
       tuslar[i].onclick=function(){
        var deger=this.innerText;
        switch(deger){
            case 'C':
            toplam.value="";
            break;
            case '0':
                var dgr=parseFloat(toplam.value);
                if(dgr>0){
                    toplam.value+=deger;
                }else if(toplam.value.length>1){
                    toplam.value+=deger;
                }
                else{toplam.value='0.'}
                break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                toplam.value+=deger;
               break;
               case ',':
               case '.':
              
                if(toplam.value.includes(',')||toplam.value.includes('.')){ }
                else{ if(toplam.value.length<1){toplam.value='0.';}else{toplam.value+=deger;}
               }
                break;
        }
       };
    }
}
async function checkTransfer(tranferReq){
   /* const url = solanaWeb3.clusterApiUrl('devnet', false);
    const connection = new solanaWeb3.Connection(url);*/

    var signatureResult=await getSignaturesForAddress(tranferReq.refkey);
    if(signatureResult.result.length>0){
        var oldestIndex=signatureResult.result.length-1;
        const oldestConfirmation=signatureResult.result[oldestIndex];
        var confirmationStatus=oldestConfirmation.confirmationStatus;
        if(confirmationStatus==='finalized'){
           
            
            /* is full payment */
            const transaction = await getTransaction(oldestConfirmation.signature);
            if(transaction&&transaction.result.meta){

                /*is spl_token*/
                if(tranferReq.isSpl){
                   
                  var  crpn = "1";
                  var dong = transaction.result.meta.preTokenBalances[0].uiTokenAmount.decimals;
                  for (var i = 0; i < dong; i++)
                  {
                      crpn += "0";
                  }
                  var preTokenBalances =BigInt(transaction.result.meta.preTokenBalances[0].uiTokenAmount.amount);
                  var postTokenBalances = BigInt(transaction.result.meta.postTokenBalances[0].uiTokenAmount.amount);
                  var gonderim = (preTokenBalances - postTokenBalances);
                  var crpn2 = BigInt(crpn);
                 var fGonderilen=parseFloat(gonderim);
                 var fcrpn=parseFloat(crpn2);
                  var gonderilen= fGonderilen/fcrpn;
                  if ((transaction.result.meta.preTokenBalances[1].owner == tranferReq.recipient && transaction.result.meta.preTokenBalances[1].mint == tranferReq.tokenaddress)&&(gonderilen == tranferReq.amount))
                        {
                            dataFetcher.stop();
                            document.getElementById('paymentResult').innerHTML=' Requested: <b>'+transferRequest.amount+' '+reqtokenname+ '</b><br>Status: <b>Payment is Completed</b>';
                        }
                }
                 /*is spl_token*/
                 /*is solana*/
                 else{
                var fark = transaction.result.meta.postBalances[1] - transaction.result.meta.preBalances[1];
                var fk=parseFloat(fark);
                var sendedAmount=fk/1000000000;
                document.getElementById('paymentResult').innerHTML=' Requested: <b>'+tranferReq.amount+'</b><br>Status: <b>Payment is Completed</b>';
                dataFetcher.stop();
            } 
                /*is solana*/
            }
                  

                

                 
            }
            /* is full payment */
        }
   
    else{
       
    }

}

function isFullPayment(tranferReq){


}

/*RPCClient*/

async function  getSignaturesForAddress(address){
    const rpcRequest= {"jsonrpc": "2.0","id": 1,"method": "getSignaturesForAddress","params": ["refkey_",{"limit": 1}]};
const rpcReqString=JSON.stringify(rpcRequest).replace("refkey_",address);  

const result= await RpcCall(rpcReqString);
   
return result;
}

async function getSignatureStatuses(signature){
const rpcRequest= {"jsonrpc": "2.0","id": 1,"method": "getSignatureStatuses","params": [["Signature_"],{"searchTransactionHistory":true,"encoding":"json"}]};
const rpcReqString=JSON.stringify(rpcRequest).replace("Signature_",signature);  
const result= await RpcCall(rpcReqString);
   
   return result;
     
}
async function getTransaction(signature){
    const rpcRequest= {"method":"getTransaction","params":["signature_",{"encoding":"json","commitment":"finalized"}],"jsonrpc":"2.0","id":0};
const rpcReqString=JSON.stringify(rpcRequest).replace("signature_",signature);  
const result= await RpcCall(rpcReqString);
return result;
}


async function RpcCall(rpcRequest){
    const response =   await fetch('https://api.devnet.solana.com/', {
        method: "POST",
        headers: {
         "Content-Type": "application/json",
        },
        body: rpcRequest,
        })
         
       return await response.json();
}
/*RPCClient*/




function SmartInterval(asyncFn, delayMs) {
    this.asyncFn = asyncFn;
    this.delayMs = delayMs;

    this.running = false;
}

SmartInterval.prototype.cycle = async function (forced) {
    await this.asyncFn();
    await this.delay(this.delayMs);
    if (!forced && this.running) this.cycle();
};

SmartInterval.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    this.cycle();
};

SmartInterval.prototype.stop = function () {
    if (this.running) this.running = false;
};

SmartInterval.prototype.forceExecution = function () {
    if (this.running) this.cycle(true);
};

// This function is just an arbitrary delay to be used with async/await pattern
SmartInterval.prototype.delay = function (ms) {
    return new Promise(res =>
        setTimeout(() => res(1), ms)
    );
};