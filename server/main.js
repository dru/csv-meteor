import { Meteor } from 'meteor/meteor';

export const Rows = new Mongo.Collection('rows');

if (Meteor.isServer) {
  Meteor.publish('rows', function() {
    if (! this.userId)
      return this.Ready()
      
    return Rows.find({owner: this.userId}, {limit: 100}, {reactive: false})
  })
}

export const Validations = {
  $and: [
    { phone: {$ne: ""} },
    { email: {$ne: ""} }
  ]
}

Meteor.startup(() => {
    return Meteor.methods({
      
        removeAllRows: function() {
            if (! Meteor.userId()) {
              throw new Meteor.Error('not-authorized');
            }
          
            return Rows.remove({owner:Meteor.userId()});
        },
        
        validateData: () => {
          if (! Meteor.userId()) {
            throw new Meteor.Error('not-authorized');
          }
          Validations.owner = Meteor.userId() 
          Rows.update(Validations, {$set: {valid: true}}, {multi: true})
        },

        insertData: (dataArray) => {
            if (! Meteor.userId()) {
              throw new Meteor.Error('not-authorized');
            }
            
            var chunkSize = 3000
            var bulkOp = Rows.rawCollection().initializeUnorderedBulkOp()
            var counter = 0
            
            for (data of dataArray) {
                data.owner = Meteor.userId()
                bulkOp.insert(data)
                counter++
                if (counter % chunkSize == 0) {
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