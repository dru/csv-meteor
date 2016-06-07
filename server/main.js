import { Meteor } from 'meteor/meteor';


export const Rows = new Mongo.Collection('rows');

Meteor.startup(() => {
  Rows.allow({
    insert: function(){ return true }
  });
  
  return Meteor.methods({

       removeAllRows: function() {

         return Rows.remove({});

       }

     });
  
});
