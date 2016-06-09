import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo'

export const Rows = new Mongo.Collection('rows')

RowsSub = false

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY',
});

TotalRows = new ReactiveVar("Ready")

Papa.LocalChunkSize = 1024 * 1024 * 1

Template.readCSV.onCreated( function() {
    RowsSub = Meteor.subscribe('rows')
})

Template.readCSV.events({
  "click .readCSVButton": (event, template) => {
    TotalRows.set("Cleaning...")
    Meteor.call("removeAllRows", () => {
      TotalRows.set(0)
      
      
      if (RowsSub) {
        RowsSub.stop()
      }
        
      Papa.parse(
        template.find('#csv-file').files[0],
        {
          header: true,
          skipEmptyLines: true,
          chunk: (results, parser) => {
            console.log("chunk: " + results.data.length)
            parser.pause()
            if (results.data.length > 0) {
              Meteor.call("insertData", results.data, (err, total) => {
                console.log("return: " + total)
                TotalRows.set(TotalRows.get() + total)
                parser.resume()
              })
            }
          },
          complete: () => {
            TotalRows.set("Validating...")
            
            Meteor.call("validateData", (err, total) => {
              RowsSub = Meteor.subscribe('rows')
              TotalRows.set("Complete.")
            })
          }
        }
      )
    })
  }
})

Template.readCSV.helpers({
   
  rows: () => {
    return Rows.find({})
  },
  
  total_rows: () => TotalRows.get(),
  
  attributes: (row) => {
    if (row.valid)
      return null
      else
        return { style: "background-color:red" }
  },
    
  arrayify: (obj) => {
    var result = []
    for (key in obj) {
      result.push({ name:key, value: obj[key] })
    }
    return result
  }
})