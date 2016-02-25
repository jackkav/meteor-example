/**
 * Created by jiangkai on 16/2/25.
 */
Science.schemas.CollapsItemSchema = new SimpleSchema({
    title:{
        type: String,
        unique: true
    },
    content:{
        type: String,
        optional: true,
        autoform: {
            afFieldInput: {
                type: 'summernote',
                class: 'editor'
            }
        }
    }
});

Science.schemas.AccordionSchema = new SimpleSchema({
    title:{
        type:String
    },
    items:{
        type:[Science.schemas.CollapsItemSchema]
    }
});