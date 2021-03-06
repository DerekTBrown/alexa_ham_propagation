'use strict';

/** Alexa Ham Radio Propogation
 ** Alexa SKill for getting band report
 ** @author Derek Brown
 **/

 var _ = require('lodash');
 var Promise = require("bluebird");
 require('datejs');

 var Alexa = require('alexa-sdk');

 var band_status = require('./band_status.js');

/* Constants */
var APP_ID = "amzn1.ask.skill.97b4c4f3-d9af-4d76-ae66-ab1fc0e5e0d1";
var HELP_MESSAGE = "You should try asking me for a band report";
var HELP_REPROMPT = "What can I help you with?";
var STOP_MESSAGE = "73!";

/* Handler Function */
 exports.handler = function(event, context, callback){
   var alexa = Alexa.handler(event, context);
   alexa.appId = APP_ID;
   alexa.APP_ID = APP_ID;
   alexa.registerHandlers(handlers);
   alexa.execute();
 }

 var handlers = {
   'LaunchRequest': function () {
     this.emit('bandReport');
   },

   'bandReport' : function () {
     var self = this;

     // Get Band Report
     band_status.getBandReportJSON()

     // Read
     .then(function(report){

       // Time String
       var time_string = "here is the propogation report from N 0 N B H from " + report.updated.toString('D') + " at " + report.updated.toString('t') + ".";


       // Report String
       var report_string = "\
today expect 80 and 40 meters to be " + report.band_status.day['80m-40m'] + ", \
30 and 20 meters to be " + report.band_status.day['30m-20m'] + ", \
17 and 15 meters to be " + report.band_status.day['17m-15m']  + ", \
and 12 and 10 meters to be " + report.band_status.day['12m-10m'] + ". \
tonight expect \
80 and 40 meters to be " + report.band_status.night['80m-40m'] + ", \
30 and 20 meters to be " + report.band_status.night['30m-20m'] + ", \
17 and 15 meters to be " + report.band_status.night['17m-15m'] + ", \
and 12 and 10 meters to be " + report.band_status.night['12m-10m'] + ".";

       self.emit(':tell', time_string + ' ' + report_string);
     })

     // Handle Errors
     .catch(function(error){
       self.emit(':tell', "It seems HAM Propogation is having some technical difficulties.  Try again later, or contact support.")
     })

   },
   'AMAZON.HelpIntent': function () {
       var speechOutput = HELP_MESSAGE;
       var reprompt = HELP_REPROMPT;
       this.emit(':ask', speechOutput, reprompt);
   },
   'AMAZON.CancelIntent': function () {
       this.emit(':tell', STOP_MESSAGE);
   },
   'AMAZON.StopIntent': function () {
       this.emit(':tell', STOP_MESSAGE);
   }
 }
