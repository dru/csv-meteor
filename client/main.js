import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import { Mongo } from 'meteor/mongo'

export const Rows = new Mongo.Collection(null)

Template.readCSV.events({
    "click .readCSVButton": (event, template) => {
        Papa.parse(
            template.find('#csv-file').files[0],
            {
                header: true,
                skipEmptyLines: true,
                preview: 100,
                complete: (results) => {
//                    Meteor.call("removeAllRows")
                    Rows.batchInsert(results.data)
                }
            }
        )
    }
})

Template.readCSV.helpers({
    rows: () => Rows.find({},{limit:100}).fetch()
})

Template.registerHelper(
    'arrayify', 
    (obj) => {
        var result = []
        for (key in obj) {
            result.push({ name:key, value: obj[key] })
        }
        return result
    }
)