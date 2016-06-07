import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Mongo } from 'meteor/mongo';

import './main.html';

export const Rows = new Mongo.Collection(null);

Template.readCSV.events({
  "click .btnReadCsv": function(event, template) {
      Papa.parse(template.find('#csv-file').files[0], {
          header: true,
          complete: function(results) {
            Meteor.call('removeAllRows')
            //Rows.batchInsert(results.data)
            console.log(results.data.length)
          },
          skipEmptyLines: true,
          //preview: 100
      });
   } 
 });
 
 Template.readCSV.helpers({
   rows() {
     return Rows.find({},{limit:10})
   }
 });
 
 Template.registerHelper('arrayify',function(obj){
     var result = [];
     for (var key in obj) result.push({name:key,value:obj[key]});
     return result;
 });