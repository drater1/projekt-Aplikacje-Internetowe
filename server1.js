const express = require("express")
var hbs = require('express-handlebars');
let app = express()
const PORT = 3000;
var context = {
    
}

app.use(express.json());

app.set('views', __dirname + '/views');
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
}));
app.set('view engine', 'hbs');

app.use(express.static('static'))

const Datastore = require('nedb')

const coll1 = new Datastore({
    filename: 'kolekcja.db',
    autoload: true
});

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
})

app.get("/", function (req, res) {
    res.render('index.hbs');
})

app.get("/selected", function (req, res) {
    
    let obj = {
        ubezpieczony: req.query.ubezpieczony == "on" ? "Tak" : "Nie",
        benzyna: req.query.benzyna == "on"? "Tak" : "Nie",
        uszkodzony: req.query.uszkodzony == "on" ? "Tak" : "Nie",
        naped4x4: req.query.naped4x4 == "on"? "Tak" : "Nie",
    }

    coll1.insert(obj, function (err, newDoc) {
        coll1.find({ }, function (err, docs) {
            
            context = {
                docsy:
                    docs
            }
            
            // context.docsy.forEach(element => {
            //     element.toedit = false
            // });

            console.log(context)

            res.render('index.hbs', context);
        });
    });

})

app.get("/delete", function (req, res) {
    console.log(req.query.deletebutton)
    coll1.remove({ _id:req.query.deletebutton }, {}, function (err, numRemoved) {
        coll1.find({ }, function (err, docs) {
            
            context = {
                docsy:
                    docs
            }
            
            res.render('index.hbs', context);
        });
        
    });
    
  
})

app.get("/edit", function (req, res) {
    console.log(req.query.editbutton)
    coll1.find({ }, function (err, docs) {
            
        context = {
            docsy:
                docs
        }
        
        coll1.find({ _id:req.query.editbutton}, function (err, dozmiany) {
            
            context.docsy.forEach(element => {
                if(element._id == req.query.editbutton){
                    element.toedit = true
                }
                
            });
            console.log(context)
            res.render('index2.hbs', context);
        });
        
    });
 
  
})
app.get("/cancel", function (req, res) {
   
    res.render('index.hbs', context);

});

app.get("/update", function (req, res) {
   
    coll1.find({ }, function (err, docs) {
            
        context = {
            docsy:
                docs
        }
        
        coll1.find({ _id:req.query.updatebutton}, function (err, dozmiany) {
            
            context.docsy.forEach(element => {
                if(element._id == req.query.updatebutton){
                    
                    element.ubezpieczony = req.query.selectUbezpieczony
                    element.benzyna = req.query.selectBenzyna
                    element.uszkodzony = req.query.selectUszkodzony
                    element.naped4x4 = req.query.selectNaped4x4

                    
                        obiekt={
                            ubezpieczony: req.query.selectUbezpieczony,
                            benzyna: req.query.selectBenzyna,
                            uszkodzony:req.query.selectUszkodzony,
                            naped4x4: req.query.selectNaped4x4,
                        }
                            
                    
                    coll1.update({ _id: req.query.updatebutton }, { $set: obiekt }, {}, function (err, numUpdated) {
                        
                    });
                }
                
            });
            console.log(context)
            res.render('index2.hbs', context);
        });
        
    });

});


