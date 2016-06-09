import { Meteor } from 'meteor/meteor';


export const Rows = new Mongo.Collection('rows');

Meteor.startup(() => {
    Rows.allow({
        insert: function(){ return true }
    });
  
    return Meteor.methods({

        removeAllRows: function() {
            return Rows.remove({});
        },

        insertData: (dataArray) => {
            var chunkSize = 3000
            var bulkOp = Rows.rawCollection().initializeUnorderedBulkOp()
            var counter = 0
            console.log("Got data")
            for (data of dataArray) {
                bulkOp.insert(data)
                counter++
                if (counter % chunkSize == 0) {
                    console.log(3000)
                    bulkOp.execute(function(e, result) {})
                    bulkOp = Rows.rawCollection().initializeUnorderedBulkOp()
                }
            }

            if (counter % chunkSize != 0){
                bulkOp.execute(function(e, result) {})
            }
             
            return dataArray.length
        }

    });
  
});
