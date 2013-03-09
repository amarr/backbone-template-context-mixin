backbone-template-context-mixin
===============================

A Backbone model mixin for generating complex ```template()``` contexts quickly. Capable of building contexts automatically from model attributes and functions via introspection or from a list of model functions.

For example, consider the following usage example:

```javascript
var UserModel = Backbone.Model.extend({
    fullName : function() {
        return this.get('firstName') + ' ' + this.get('lastName');
    },
    
    isBirthday : function() {
        var now = new Date();
        return this.get('birthday') == now.getTime();
    }
});

var user = new UserModel({
    firstName : 'Bob',
    lastName : 'Jones',
    birthday : 10000000000
});

var cxt = user.getContext();
```

In this case, the resulting ```cxt``` would be:

```javascript
{
    firstName : "Bob",
    lastName : "Jones",
    fullName : "Bob Jones",
    isBirthday : false
}
```

This is a ready to inject template context without requiring additional helpers or maintaining composite 
attributes which you could use in Handlebars like so:

```html
<div id="welcome">
    {{#if isBirthday}}
    Happy Birthday, {{fullName}}!
    {{else}}
    Nice to see you, {{firstName}}.
    {{/if}}
</div>
```

## getContext([Object json])

You should call ```model.getContext()``` instead of ```model.toJSON()``` when creating a context to pass to 
a ```template()``` function.

When invoked, this method combines

* Model attributes
* Custom model methods that haven't been excluded
* Additional properties suppplied via the ```json``` argument

Custom model methods are called again with each call to ```getContext``` to ensure freshness.

To exclude a custom function, your model should implement ```templateContextExclusions```.

By default, all Backbone.Model functions are excluded.

## setContext(Array functions)

Optionally, you can manually call this function passing an array of function names to specify only the list of 
functions on this model that you wish to include in the template context.

If not set explicitely, this list is built from all available custom functions.

This is helpful for porting existing models.

## templateContextExclusions()

Optionally implement this method to return an array of function names to exlude from the template context.

This is helpful for porting existing models.
