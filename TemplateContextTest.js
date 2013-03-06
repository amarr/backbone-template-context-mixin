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
require(["mixins/TemplateContext"], function(TemplateContext) {
    
    module('StartUp', {
        setup : function() {
            this.model = new Backbone.Model({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            _.extend(this.model, TemplateContext);
            
            this.MyModel = Backbone.Model.extend({});
            
            _.extend(this.MyModel.prototype, TemplateContext);
        }
    });
    
    test('initialize on instance and call get', function() {
        ok(this.model.hasOwnProperty('setContext'), 'Has setContext');
        ok(this.model.hasOwnProperty('getContext'), 'Has getContext');

        this.model.getContext();

        ok(this.model.hasOwnProperty('_templateContext'), 'Has _templateContext');
    });
    
    test('initialize on instance and call set', function() {
        ok(this.model.hasOwnProperty('setContext'), 'Has setContext');
        ok(this.model.hasOwnProperty('getContext'), 'Has getContext');

        this.model.setContext({});

        ok(this.model.hasOwnProperty('_templateContext'), 'Has _templateContext');
    });    
    
    test('initialize on class and call get', function() {
        var model = new this.MyModel({
            p1:'v1'
        });
        
        ok(_.isFunction(model['setContext']), 'Has setContext');
        ok(_.isFunction(model['getContext']), 'Has getContext');

        model.getContext({});

        ok(model.hasOwnProperty('_templateContext'), 'Has _templateContext');
    });
    
    test('initialize on class and call set', function() {
        var model = new this.MyModel({
            p1:'v1'
        });
        
        ok(_.isFunction(model['setContext']), 'Has setContext');
        ok(_.isFunction(model['getContext']), 'Has getContext');

        model.setContext({});

        ok(model.hasOwnProperty('_templateContext'), 'Has _templateContext');
    });     
    
    test('initialize on class and create multiple', function() {
        var model = new this.MyModel({
            p1:'v1'
        });
        
        var model2 = new this.MyModel({
            p2:'v2'
        });
        
        
        ok(_.isFunction(model['setContext']), 'Has setContext');
        ok(_.isFunction(model['getContext']), 'Has getContext');
        
        ok(_.isFunction(model2['setContext']), 'Has setContext');
        ok(_.isFunction(model2['getContext']), 'Has getContext');

        model.setContext({});

        ok(model.hasOwnProperty('_templateContext'), 'Has _templateContext');
        ok(!model2.hasOwnProperty('_templateContext'), 'Not Has _templateContext');
    });      
        
    module('Model.setContext', {
        setup : function() {
            // Sets up mixin on a class and on an instance
            
            var MyModel = Backbone.Model.extend({
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            _.extend(MyModel.prototype, TemplateContext);

            var modelClassMixin = new MyModel({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            var modelInstMixin = new Backbone.Model({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            _.extend(modelInstMixin, TemplateContext, {
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            this.models = {
                classMixin : modelClassMixin,
                instMixin : modelInstMixin
            }
        }
    });
    
    test('set array Context with 2 funcs', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2']);

            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2
            }, 'Context set');
        });
    });
    
    test('set array Context with 2 funcs and 1 fake func', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2','bad']);
           
            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2
            }, 'Context set');
        });
    });
    
    test('set array Context with 3 funcs', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2','f3']);

            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2,
                f3:model.f3
            }, 'Context set');
        });
    });
    
    test('set object Context with 2 funcs', function() {
        _.each(this.models, function(model) {
            model.setContext({
                'f1':model.f1,
                'f2':model.f2
            });
       
            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2
            }, 'Context set');
        });
    });
    
    test('set object Context with 2 funcs and 1 fake func', function() {
        _.each(this.models, function(model) {
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'bad':'bad'
            });
       
            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2,
                'bad':'bad'
            }, 'Context set');
        });
    });
    
    test('set object Context with 3 funcs', function() {
        _.each(this.models, function(model) {
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'f3':model.f3
            });
       
            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2,
                f3:model.f3
            }, 'Context set');
        });
    });
    
    test('set object Context with composite', function() {
        _.each(this.models, function(model) {
           
            var f = function(){};
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'custom':f
            });
       
            deepEqual(model._templateContext, {
                f1:model.f1,
                f2:model.f2,
                custom:f
            }, 'Context set');
        });
    });
    
    module('Model.getContext', {
        setup : function() {
            // Sets up mixin on a class and on an instance
            
            var MyModel = Backbone.Model.extend({
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            _.extend(MyModel.prototype, TemplateContext);

            var modelClassMixin = new MyModel({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            var modelInstMixin = new Backbone.Model({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            _.extend(modelInstMixin, TemplateContext, {
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            this.models = {
                classMixin : modelClassMixin,
                instMixin : modelInstMixin
            }
        }
    });
    
    test('get object context (set array)', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2']);

            var cxt = model.getContext();

            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false
            }, 'correct context');
        });
    });
    
    test('get object context with bad (set array)', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2','bad']);
        
            var cxt = model.getContext();
        
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false
            }, 'correct context');
        });
    });
    
    test('get object context with all funcs (set array)', function() {
        _.each(this.models, function(model) {
            model.setContext(['f1','f2','f3']);
        
            var cxt = model.getContext();
        
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                f3:true
            }, 'correct context');
        });
    });
    
    test('get object context (set object)', function() {
        _.each(this.models, function(model) {
            model.setContext({
                'f1':model.f1,
                'f2':model.f2
                });
        
            var cxt = model.getContext();
        
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false
            }, 'correct context');
        });
    });
    
    test('get object context with 2 funcs and 1 fake func (set object)', function() {
       
       
        _.each(this.models, function(model) {
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'bad':'bad'
            });
       
            var cxt = model.getContext();
       
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                bad:'bad'
            }, 'correct context');
        });
    });
    
    test('get object Context with composite (set object)', function() {
       
        _.each(this.models, function(model) {
            var f = function(){
                return 'comp';
            };
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'custom':f
            });
       
            var cxt = model.getContext();
       
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                custom:'comp'
            }, 'correct context');
        });
    });   
    
    test('get object Context with composite and additional (set object)', function() {
       
        _.each(this.models, function(model) {
            var f = function(){
                return 'comp';
            };
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'custom':f
            });
       
            var cxt = model.getContext({
                add:'mine'
            });
       
            deepEqual(cxt, {
                p1:'v1',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                custom:'comp',
                add:'mine'
            }, 'correct context');
        });
    });    
    
    test('get object Context with composite function added', function() {
       
        _.each(this.models, function(model) {
            var f = function(){
                return 'comp';
            };
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'custom':f
            });
       
            var cxt = model.getContext({
                p1:'mine'
            });
       
            deepEqual(cxt, {
                p1:'mine',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                custom:'comp'
            }, 'correct context');
        });
    });    
    
    test('get object Context with composite and additional context', function() {
       
        _.each(this.models, function(model) {
            var f = function(){
                return 'comp';
            };
            model.setContext({
                'f1':model.f1,
                'f2':model.f2,
                'custom':f
            });
       
            var cxt = model.getContext({
                p1:'mine'
            });
       
            deepEqual(cxt, {
                p1:'mine',
                p2:'v2',
                p3:'v3',
                f1:true,
                f2:false,
                custom:'comp'
            }, 'correct context');
        });
    });
    
    test('get object Context with composite and additional overwrite (set object)', function() {
        var MyModel = Backbone.Model.extend({

            f1 : function() {
                return this.get('p1') == 'v1';
            },

            p2 : function() {
                return 'stuff';
            },

            f3 : function() {
                return this.get('p3') == 'v3';
            }
        });
        
        _.extend(MyModel.prototype, TemplateContext);

        var model = new MyModel({
            p1:'v1',
            p2:'v2',
            p3:'v3'
        });
        
        model.setContext(['p1','p2','p3']);
        
        deepEqual(model.getContext(), {p1:'v1',p2:'stuff',p3:'v3'}, 'correct context');
    });   
    
    module('Context Introspection', {
        setup : function() {
            // Sets up mixin on a class and on an instance
            
            var MyModel = Backbone.Model.extend({
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            _.extend(MyModel.prototype, TemplateContext);
            
            
            
            var MyOtherModel = MyModel.extend({
                f4 : function() {
                    return 'thisisme';
                }
            });

            var modelClassMixin = new MyModel({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            var modelSubclassMixin = new MyOtherModel({
                p1:'v1',
                p2:'v2',
                p3:'v3',
                p4:'v4'
            });
            
            var modelInstMixin = new Backbone.Model({
                p1:'v1',
                p2:'v2',
                p3:'v3'
            });
            
            _.extend(modelInstMixin, TemplateContext, {
          
                f1 : function() {
                    return this.get('p1') == 'v1';
                },

                f2 : function() {
                    return this.get('p2') == 'bad';
                },

                f3 : function() {
                    return this.get('p3') == 'v3';
                }
            });
            
            this.models = {
                classMixin : modelClassMixin,
                subclassMixin : modelSubclassMixin,
                instMixin : modelInstMixin
            }
        }
    });    
    
    test('getContext using introspection', function() {
        deepEqual(this.models.subclassMixin.getContext(), {p1:'v1',p2:'v2',p3:'v3',p4:'v4',f1:true,f2:false,f3:true,f4:'thisisme'}, 'correct context');
        
        deepEqual(this.models.classMixin.getContext(), {p1:'v1',p2:'v2',p3:'v3',f1:true,f2:false,f3:true}, 'correct context');
        
        deepEqual(this.models.instMixin.getContext(), {p1:'v1',p2:'v2',p3:'v3',f1:true,f2:false,f3:true}, 'correct context');
    });
    
    test('getContext using exclusions', function() {
        var ModelClass = Backbone.Model.extend({
            templateContextExclusions : function() {
                return ['f2'];
            },
            f1 : function() {
                return this.get('p1') == 'v1';
            },

            f2 : function() {
                return this.get('p2') == 'bad';
            },

            f3 : function() {
                return this.get('p3') == 'v3';
            }
        });
        
        _.extend(ModelClass.prototype, TemplateContext);
        
        var model = new ModelClass({
            p1:'v1',
            p2:'v2',
            p3:'v3'
        });
        
        deepEqual(model.getContext(), {p1:'v1',p2:'v2',p3:'v3',f1:true,f3:true}, 'correct context');
        
        var ModelSubClass = ModelClass.extend({
            templateContextExclusions : function() {
                var base = ModelClass.prototype.templateContextExclusions.apply(this, arguments);
                
                return base.concat(['f3']);
            }
        });
        
        var submodel = new ModelSubClass({
            p1:'v1',
            p2:'v2',
            p3:'v3'
        });
        
        deepEqual(submodel.getContext(), {p1:'v1',p2:'v2',p3:'v3',f1:true}, 'correct context');
    });
});
