import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo'

export const Rows = new Mongo.Collection(null)

export const Validations = {
    $and: [
      { phone: {$ne: ""} },
      { email: {$ne: ""} }
    ]
}

Template.readCSV.events({
    "click .readCSVButton": (event, template) => {
        Papa.parse(
            template.find('#csv-file').files[0],
            {
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
//                    Meteor.call("removeAllRows")
                    Rows.batchInsert(results.data)
                    Rows.update(Validations, {$set: {valid: true}}, {multi: true})
                }
            }
        )
    }
})

Template.readCSV.helpers({
  
    rows: () => Rows.find({},{limit:200}).fetch(),
  
    total_rows: () => Rows.find().count(),
  
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