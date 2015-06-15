"use strict";
require("es5-shim")
require("babel/register")
var backbone = require('backbone')
var Promise = require('es6-promise').Promise
import * as templates from './templates.js'

var etsy_key = `wefcxmyls4vtcub1b50im5a1`,
    etsy_url = (id) => `https://openapi.etsy.com/v2/listings/${id}.js?api_key=${etsy_key}&includes=Images&callback=?`,
    details_url = (id) => `https://openapi.etsy.com/v2/listings/${id}.js?api_key=${etsy_key}&callback=?`

var EtsyRouter = backbone.Router.extend({
    initialize() {
            this.active_listings = new EtsyCollection()
            backbone.history.start()
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
            var current_item = this.active_listings.get(objid)
            var current_index = this.active_listings.indexOf(current_item)
            var current_detailed_view = new DetailedView({model: current_item
            })
            current_item.fetch().then((data) => console.log(data))
        }
})
var EtsyModel = backbone.Model.extend({
    initialize: function() {

    },
    idAttribute: 'listing_id',
    url: function() {
        return details_url(this.id)
    }
})

var EtsyCollection = backbone.Collection.extend({
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

var ActiveListingsView = backbone.View.extend({
    el: '.page',
    initialize: function() {
        this.listenTo(this.collection, "sync", this.render)
        this.listenTo(this.collection, "request", this.loader)
    },
    loader: function() {
        this.el.innerHTML = "<p>... loading</p>"
    },
    template: function(arr) {
        return templates.homeview(arr)
    },
    render: function() {
        var json = this.collection.toJSON()
        this.el.innerHTML = this.template(json)
    }
})

var DetailedView = backbone.View.extend({
    el: '.page',
    initialize: function() {
        this.listenTo(this.model, "sync", this.render)
        this.listenTo(this.model, "request", this.loader)
    },
    loader: function() {
        this.el.innerHTML = "<p>... loading</p>"
    },
    template: function(obj) {
        return templates.detailedView(obj)
    },
    render: function() {
        var json = this.model.toJSON()
        this.el.innerHTML = this.template(json)
    }
})

var etsyApp = new EtsyRouter()
