/*
Copyright (c) 2012 Austin Marron and contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
(function(w) {
    /**
     * Intended to be mixed into any Model or Collection.
     * 
     * Provides functionality to easily build template context objects from a 
     * combination of attributes and methods.
     * 
     * Usage for a class:
        
        _.extend(MyModel.prototype, TemplateContext);
     *
     * User for an object
        
        _.extend(model, TemplateContext);
     *
     * @class TemplateContext
     * @extensionfor Model
     * @extensionfor Collection
     */
    var TemplateContext = {
        /**
         * Optionally implement this method in order to specify functions that 
         * should be excluded from the introspection process.
         * 
         * By default, 'constructor', 'getContext', 'setContext', 'templateContextExclusions'
         *  are excluded in addition to all methods on Backbone.Model
         *
         * @method templateContextExclusions
         * @return {Array} Method names to be excluded
         */
        
        /**
         * Define the methods on this object to use to build the context.
         * 
         * This can be done automatically if not called.
         *
         * @method setContext
         * @param {Array/Object} cxt Either an array of function names in the model
         *  or a hash of string:function pairs.
         */
        setContext : function(cxt) {
            this._templateContext = {};
            
            if(_.isArray(cxt)) {
                _.each(cxt, function(entry) {
                    if(_.isFunction(this[entry])) {
                        this._templateContext[entry] = this[entry];
                    }
                    else {
                        console.error("%s is not a valid method.", entry);
                    }
                }, this);
            }
            else if(_.isObject(cxt)) {
                this._templateContext = cxt;
            }
            else {
                console.error('Bad context received.');
            }
        },
        
        /**
         * Return a context object ready for injection into a template.
         * 
         * Optionally, additional context can be added for just this invocation.
         * 
         * If no context is set explicitely, the methods on the model are 
         * introspected and the context is built automatically.
         *
         * @method getContext
         * @param {Object} [additionalContext] Temporary context to add just for 
         *  this invocation.
         * @return {Object} The computed context (Attributes + Context + Additional)
         */
        getContext : function(additionalContext) {
            // In case we haven't called set first, we build the context using 
            // some introspection, removing Backbone methods and our own.
            if(!this.hasOwnProperty('_templateContext')) {
                var baseExclusions = _.functions(Backbone.Model.prototype);
                var modelExclusions = ['constructor', 'getContext', 'setContext', 'templateContextExclusions'];
                
                if(_.isFunction(this['templateContextExclusions'])) {
                    var customExclusions = this.templateContextExclusions.call(this);
                    modelExclusions = modelExclusions.concat(customExclusions);
                }
                
                var allFuncs = _.functions(this);
                var contextFuncs = _.difference(allFuncs, baseExclusions, modelExclusions);
                
                this.setContext(contextFuncs);
            }
            
            var computedContext = this.toJSON();

            _.each(this._templateContext, function(value, name) {
                if(_.isFunction(value)) {
                    computedContext[name] = value.call(this);
                }
                else {
                    computedContext[name] = value;
                }
            }, this);
            
            if(_.isObject(additionalContext)) {
                return _.extend(computedContext, additionalContext);
            }
            else {
                return computedContext;
            }
        }
    };
    
    if(_.isFunction(w.define)) {
    	w.define(function() {
    		return TemplateContext;
    	});
    }
    else {
    	w.Backbone.TemplateContext = TemplateContext;
    }
})(this);
