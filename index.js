// // //--------------------------------BLOCKING-WAY-------------------------
// // // const hello ='Hello world';
const fs = require('fs');               //accesing file system

// // // console.log(hello);
// // const textIn=fs.readFileSync('./txt/input.txt','utf-8');  //reading content from text file
// // console.log(textIn);

// // const textOut=`this is what we know : ${textIn}. \nCreated on ${Date.now()}`;   //using backticks ES6
// // fs.writeFileSync('./txt/output3.txt',textOut);
// // // const Textout='this is what we got '+textIn;
// // // fs.writeFileSync('./txt/output4.txt',Textout);
// // console.log('file written');

// //---------------------------------NON-BLOCKING WAY-----(Asynchronous Way)----------
// fs.readFile('./txt/start.txt','utf-8', (err,data)=> {
//     console.log(data);                                   //second parameter of this asynchrn readfile is callback function with two param err and actual data
// });
// console.log('will read file!');

//-----------------------------SERVER----------------------------------
const http = require('http');
// const server=http.createServer((req,res)=>{             // creating a server
//     res.end('hello from the server');      //callback function
// });

// server.listen(8000, '127.0.0.1',()=>{
//     console.log('listening to request on port no 8000');
// });

//----------------------------URL-------------------------------------------
const url = require('url');

const replaceTemplate = (temp,product)=>{
    let output=temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image); 
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENT%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);

    if(!product.organic) output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}

//these are top level code hence we can use synch code here, once our server loaded it runs only once at beginning
const tempOverview=fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8');
const tempCard=fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8');
const tempProduct=fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8');

const data=fs.readFileSync(`${__dirname}/dev-data/data.json`,'utf-8');
const dataObj = JSON.parse(data);                                      //array of 5 objects //parsd json file

const server = http.createServer((req, res) => {             // creating a server
    

    // const pathname = req.url;
    const {query,pathname} = url.parse(req.url,true);

    // Overview page
    if (pathname === '/' || pathname ==='/overview') {
        res.writeHead(200, {
            'Content-type' : 'text/html',
        })

        const cardsHtml= dataObj.map(el => replaceTemplate(tempCard,el)).join('');       //each card title is getting replaced by json elm.  //array of prodcards
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml);              //these product cards will be shown here
        // console.log(cardsHtml);

        res.end(output);
    }

    //Product Page
    else if (pathname === '/product') {
        res.writeHead(200,{'Content-type' : 'text/html'});
        const product=dataObj[query.id];
        const output = replaceTemplate(tempProduct,product);
        res.end(output);
    }

    //API
    else if (pathname === '/api') {
        
        // fs.readFile(`${__dirname}/dev-data/data.json`,'utf-8',(err,data)=>{
        //     const productData= JSON.parse(data);
        //     res.writeHead(200,{'Content-type' : 'application/json'});                           //this is asynchronous way of reading
        //     res.end(data);                                                                      //but not recommended here because it is already read at th top
        // });

        res.writeHead(200,{'Content-type' : 'application/json'});                           //this is asynchronous way of reading
        res.end(data);  
    }

    //NOT FOUND
    else {
        res.writeHead(404, {
            'Content-type' : 'text/html',
            'my-own-header' : 'hello-world'
        })
        res.end('<h1>Page Not Found<h1/>');
    }
                                                            
});

server.listen(9000, '127.0.0.1', () => {
    console.log('listening to request on port no 9000');
});







