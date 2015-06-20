"use strict";
require("es5-shim")
require("babel/register")
var $ = require('jquery')
var Backbone = require('backbone')
var React = require('react')
var Promise = require('es6-promise').Promise
import * as templates from './templates.js'

var etsy_key = `wefcxmyls4vtcub1b50im5a1`,
    etsy_url = (id) => `https://openapi.etsy.com/v2/listings/${id}.js?api_key=${etsy_key}&includes=Images&callback=?`

var EtsyRouter = Backbone.Router.extend({
    initialize: function() {
        this.active_listings = new EtsyCollection()
        Backbone.history.start()
        this.active_listings.fetch()
    },
    routes: {
        'details/:objid': 'details',
        '*anything': 'home'
    },
    home: function() {
        var active_listings_view = new ActiveListingsView({
            collection: this.active_listings
        })
        active_listings_view.render()
    },
    details: function(objid) {
        this.current_item = this.active_listings.get(objid);
        this.current_index = this.active_listings.indexOf(this.current_item);
        this.current_detailed_view = new DetailedView({
            model: this.current_item
        }),
        this.current_detailed_view.render()
    }
})
var EtsyModel = Backbone.Model.extend({
    initialize: function() {},
    idAttribute: 'listing_id',
    url: function() {
        return details_url(this.id)
    }
})

var EtsyCollection = Backbone.Collection.extend({
        model: EtsyModel,
        initialize: function() {},
        url: function() {
            return etsy_url('active')
        },
        parse: function(json) {
            console.log(json.results)
            return json.results
        }
    })
    // // View

var ActiveListingsView = Backbone.View.extend({
    el: '.page',
    initialize: function() {
        this.listenTo(this.collection, "sync", this.render)
        this.listenTo(this.collection, "request", this.loader)
    },
    loader: function() {
        this.el.innerHTML = "<img class='logo' src='../Images/etsy3.svg' /><img class='mag' src='../Images/magnifying47.svg' />"
        debugger
    },
    template: function(arr) {
        return templates.homeview(arr)
    },
    render: function() {
        var json = this.collection.toJSON()
        this.el.innerHTML = this.template(json)
    }
})

var DetailedView = Backbone.View.extend({
    el: '.page',
    template: function(obj) {
        return templates.detailedView(obj)
    },
    render: function() {
        var json = this.model.toJSON()
        this.el.innerHTML = this.template(json)
    }
})

var etsyApp = new EtsyRouter()
