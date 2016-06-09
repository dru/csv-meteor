import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo'

export const Rows = new Mongo.Collection("rows")

export const Validations = {
    $and: [
      { phone: {$ne: ""} },
      { email: {$ne: ""} }
    ]
}

TotalRows = new ReactiveVar(0)

Papa.LocalChunkSize = 1024 * 1024 * 1

Template.readCSV.events({
    "click .readCSVButton": (event, template) => {
        Meteor.call("removeAllRows", () => {
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
                    }
                }
            )
        })
    }
})

Template.readCSV.helpers({
  
    rows: () => Rows.find({},{limit:100}).fetch(),
  
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