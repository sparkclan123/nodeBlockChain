
const begin = require('express');
const sha256 = require('crypto-js/sha256');
const app = begin();
app.use(begin.urlencoded({extended:true}));
app.use(begin.json());


class Block {
    constructor(index, timestamp, transection, precedingHash = null){
        this.index = index;
        this.timestamp = timestamp;
        this.transection = transection;
        // precedingHash คือ hash เก่า กับ hash เป็น hash ตัวใหม่ที่เอาไว้เก็บใน block ต่อๆ ไป
        this.precedingHash = precedingHash;
        this.hash = this.computeHash();
    }

    computeHash(){
        return sha256(
            this.index + this.precedingHash + this.timestamp + JSON.stringify(this.transection)
        ).toString();
    }

}

class BlockChain{
    constructor(){
        this.id = null
        this.name = null
        this.blockchain = null
        this.diff = null
    }

    create(id, name, gen){
        this.id = id
        this.name = name
        this.blockchain = [this.startGenBlock(gen)]
        this.dff = 4
    }

    startGenBlock(gen){
        return new Block(0 , gen.date, gen.transection, "0")
    }

    obtainLatestBlock(){
        return this.blockchain[this.blockchain.length - 1]
    }

    addNewBlock(newBlock){
        newBlock.precedingHash = this.obtainLatestBlock().hash;
        newBlock.hash = newBlock.computeHash()
        this.blockchain.push(newBlock)
    }

    checkChainvail(){
        for (let index = 1; index < this.blockchain.length; index++) {
            const currentBlock = this.blockchain[i];
            const precedingBlock = this.blockchain[i-1];

            if(currentBlock.hash !== currentBlock.computeHash() ){
                return false;
            }

            if(currentBlock.precedingHash !== precedingBlock.hash ){
                return false;
            }
            
        }

        return true;
    }

}

// ระบุ block เป็น GlobalChain เพื่อให้ส่วนอื่นเรียกใช้งานได้
const GlobalChain = new BlockChain

// สร้าง การทำงานของเหรียนตัวเอง
class PorCoin {
    constructor(){
        this.chain = []
    }
    validateNewChain = (req, res, next) => {
        if(req.body){
            if(req.body.id && req.body.name && req.body.name && req.body.gen && req.body.gen.date && req.body.gen.transection){
                next();
            }else{
                res.status(400).json({message:'request format is not true'})
            }
        }else{
            res.status(400).json({message:'request format is not true main'})
        }
    }

    createNewChain = (req ,res) => {
        const block = GlobalChain.create(req.body.id, req.body.name, req.body.gen)
        res.status(200).json({message:'it can be create chain' , data :GlobalChain})
    }

    appendNewChild=(req, res)=>{
        const block = new Block (this.chain.length, req.body.timestamp, req.body.transection)
        console.log(req.body)
        GlobalChain.addNewBlock(block)
        res.status(200).json({message:'it can be create block', data :GlobalChain})
    }

    getChain = (req, res)=>{
        res.status(200).json({chain:GlobalChain })
    }

}

// สร้าง controller เพื่มเรียกใช้งาน
const Controller = new PorCoin();

app.get('/',(req,res)=>{
    res.status(200).json({message:'mainpage' })
});

app.post('/api/blockchain',Controller.validateNewChain , Controller.createNewChain);
app.get('/api/blockchain',Controller.getChain);
app.post('/api/blockchain/append', Controller.appendNewChild);

// start port ทุกครั้ง ก่อนใช้งาน
app.listen(8080, () => {
    console.log('test running')
});


