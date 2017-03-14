//Creates environment variables from .env file
require('dotenv').config();

var express = require('express');
var request = require('request');
var QPX = require('qpx-express');
var qpx = new QPX(process.env.GOOGLE_FLIGHTS_KEY);
var db = require('../models');
var router = express.Router();

// SHOW FLIGHTS SEARCH FORM
router.get('/', function(req, res){
  res.render('flights/index', {
  });
});

router.post('/', function(req, res){
  var query = req.body;
  console.log(req.body);

  // BUILD THE FLIGHT REQUEST OBJECT
  var url = 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=' + process.env.GOOGLE_FLIGHTS_KEY;
  var requestObj = {
    request: {
      passengers: {
        adultCount: query.passengers,
      },
      slice: [
        {
          origin: query.origin,
          destination: query.destination,
          date: query.departureDate,
        },
        {
          origin: query.destination,
          destination: query.origin,
          date: query.returnDate,
        }
      ],
      saleCountry: "US",
      ticketingCountry: "US",
      solutions: 20
    }
  }

  if(new Date(query.departureDate) > new Date(query.returnDate)){
    body = {
      error: {
        message: "Return date must be after departure date."
      }
    }
    res.render('flights/index', {
      "query": query,
      "response": body,
    })
  }
  // TEST BELOW
  //
  // var body = {
  //  "kind": "qpxExpress#tripsSearch",
  //  "trips": {
  //   "kind": "qpxexpress#tripOptions",
  //   "requestId": "c9gsCiI4xJKgbeptA0QAHM",
  //   "data": {
  //    "kind": "qpxexpress#data",
  //    "airport": [
  //     {
  //      "kind": "qpxexpress#airportData",
  //      "code": "PDX",
  //      "city": "PDX",
  //      "name": "Portland International"
  //     },
  //     {
  //      "kind": "qpxexpress#airportData",
  //      "code": "SEA",
  //      "city": "SEA",
  //      "name": "Seattle/Tacoma Sea/Tac"
  //     },
  //     {
  //      "kind": "qpxexpress#airportData",
  //      "code": "SFO",
  //      "city": "SFO",
  //      "name": "San Francisco International"
  //     }
  //    ],
  //    "city": [
  //     {
  //      "kind": "qpxexpress#cityData",
  //      "code": "PDX",
  //      "name": "Portland"
  //     },
  //     {
  //      "kind": "qpxexpress#cityData",
  //      "code": "SEA",
  //      "name": "Seattle"
  //     },
  //     {
  //      "kind": "qpxexpress#cityData",
  //      "code": "SFO",
  //      "name": "San Francisco"
  //     }
  //    ],
  //    "aircraft": [
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "319",
  //      "name": "Airbus A319"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "320",
  //      "name": "Airbus A320"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "738",
  //      "name": "Boeing 737"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "739",
  //      "name": "Boeing 737"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "73H",
  //      "name": "Boeing 737"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "CR7",
  //      "name": "Canadair RJ 700"
  //     },
  //     {
  //      "kind": "qpxexpress#aircraftData",
  //      "code": "DH4",
  //      "name": "De Havilland-Bombardier Dash-8"
  //     }
  //    ],
  //    "tax": [
  //     {
  //      "kind": "qpxexpress#taxData",
  //      "id": "ZP",
  //      "name": "US Flight Segment Tax"
  //     },
  //     {
  //      "kind": "qpxexpress#taxData",
  //      "id": "AY_001",
  //      "name": "US September 11th Security Fee"
  //     },
  //     {
  //      "kind": "qpxexpress#taxData",
  //      "id": "US_001",
  //      "name": "US Transportation Tax"
  //     },
  //     {
  //      "kind": "qpxexpress#taxData",
  //      "id": "XF",
  //      "name": "US Passenger Facility Charge"
  //     }
  //    ],
  //    "carrier": [
  //     {
  //      "kind": "qpxexpress#carrierData",
  //      "code": "AS",
  //      "name": "Alaska Airlines Inc."
  //     },
  //     {
  //      "kind": "qpxexpress#carrierData",
  //      "code": "UA",
  //      "name": "United Airlines, Inc."
  //     },
  //     {
  //      "kind": "qpxexpress#carrierData",
  //      "code": "VX",
  //      "name": "Virgin America Inc."
  //     }
  //    ]
  //   },
  //   "tripOption": [
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ008",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 46,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 46,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "3406"
  //         },
  //         "id": "G54bNasxhuxBwrYD",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L-ziuG2n5hWPd09P",
  //           "aircraft": "CR7",
  //           "arrivalTime": "2017-03-14T15:16-07:00",
  //           "departureTime": "2017-03-14T14:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 46,
  //           "operatingDisclosure": "OPERATED BY SKYWEST AIRLINES AS ALASKASKYWEST",
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 43,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 43,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2259"
  //         },
  //         "id": "GuubbVoM6WaAhkp5",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lzshc9-2OEt086DU",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-15T21:43-07:00",
  //           "departureTime": "2017-03-15T21:00-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 43,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 54,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "G54bNasxhuxBwrYD"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GuubbVoM6WaAhkp5"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T17:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ007",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2642"
  //         },
  //         "id": "G1tgMnCrvAkWeKmm",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 4,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Ly3EDsHEmVcIGyV0",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T16:22-07:00",
  //           "departureTime": "2017-03-14T15:35-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 46,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "G1tgMnCrvAkWeKmm"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T18:34-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ006",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2196"
  //         },
  //         "id": "GI85iHqCYAmLFKvF",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lw1zyG2gqlwRGDEo",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T16:47-07:00",
  //           "departureTime": "2017-03-14T16:00-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 100,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GI85iHqCYAmLFKvF"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T18:59-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ001",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 46,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 46,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "3406"
  //         },
  //         "id": "G54bNasxhuxBwrYD",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L-ziuG2n5hWPd09P",
  //           "aircraft": "CR7",
  //           "arrivalTime": "2017-03-14T15:16-07:00",
  //           "departureTime": "2017-03-14T14:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 46,
  //           "operatingDisclosure": "OPERATED BY SKYWEST AIRLINES AS ALASKASKYWEST",
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "G54bNasxhuxBwrYD"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T17:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ002",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 46,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 46,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "3448"
  //         },
  //         "id": "GdIe3vVjkhMHDbrt",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LljZivng5bFMTzq1",
  //           "aircraft": "CR7",
  //           "arrivalTime": "2017-03-14T18:16-07:00",
  //           "departureTime": "2017-03-14T17:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 46,
  //           "operatingDisclosure": "OPERATED BY SKYWEST AIRLINES AS ALASKASKYWEST",
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GdIe3vVjkhMHDbrt"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T20:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ003",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2162"
  //         },
  //         "id": "GbF4fIranYrzgdPz",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 6,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L+iNZRYnM2aNBZwh",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T17:17-07:00",
  //           "departureTime": "2017-03-14T16:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 76,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GbF4fIranYrzgdPz"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T19:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ009",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2112"
  //         },
  //         "id": "GAuVapn5EeIzwg8U",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LXe3YAhqgOhxt2Lf",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T21:47-07:00",
  //           "departureTime": "2017-03-14T21:00-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 40,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GAuVapn5EeIzwg8U"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T23:59-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00A",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2246"
  //         },
  //         "id": "GgddQPwox3CfalmV",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LQajQAP+k52fHRIk",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T08:17-07:00",
  //           "departureTime": "2017-03-14T07:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 68,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GgddQPwox3CfalmV"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T10:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ004",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2316"
  //         },
  //         "id": "GvOVmn6MmLoKyewp",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LI93fck6Z8RdSoRZ",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T22:17-07:00",
  //           "departureTime": "2017-03-14T21:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 31,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GvOVmn6MmLoKyewp"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-15T00:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD416.40",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ005",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 47,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 47,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "2624"
  //         },
  //         "id": "G3EcBZnqyOAsmi6G",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L-nTbXoNoD8hHpNJ",
  //           "aircraft": "DH4",
  //           "arrivalTime": "2017-03-14T13:17-07:00",
  //           "departureTime": "2017-03-14T12:30-07:00",
  //           "origin": "PDX",
  //           "destination": "SEA",
  //           "duration": 47,
  //           "operatingDisclosure": "OPERATED BY HORIZON AIR AS ALASKAHORIZON",
  //           "onTimePerformance": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 42,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 42,
  //         "flight": {
  //          "carrier": "AS",
  //          "number": "414"
  //         },
  //         "id": "GsEmX2-k+VWVBuSN",
  //         "cabin": "COACH",
  //         "bookingCode": "Y",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LVlTpVkp0p7tKOBP",
  //           "aircraft": "73H",
  //           "arrivalTime": "2017-03-15T23:52-07:00",
  //           "departureTime": "2017-03-15T23:10-07:00",
  //           "origin": "SEA",
  //           "destination": "PDX",
  //           "duration": 42,
  //           "mileage": 129,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "PDX",
  //         "destination": "SEA",
  //         "basisCode": "YASR1"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "carrier": "AS",
  //         "origin": "SEA",
  //         "destination": "PDX",
  //         "basisCode": "YASR1"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "GsEmX2-k+VWVBuSN"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AmnEqpZe7u9Qk99Sw76hooDRLLSI4t/Yoy3jH2m8aPz2",
  //         "segmentId": "G3EcBZnqyOAsmi6G"
  //        }
  //       ],
  //       "baseFareTotal": "USD360.94",
  //       "saleFareTotal": "USD360.94",
  //       "saleTaxTotal": "USD55.46",
  //       "saleTotal": "USD416.40",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD27.06"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD9.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD8.20"
  //        }
  //       ],
  //       "fareCalculation": "PDX AS SEA 180.47YASR1 AS PDX 180.47YASR1 USD 360.94 END ZP PDX SEA XT 27.06US 8.20ZP 11.20AY 9.00XF PDX4.50 SEA4.50",
  //       "latestTicketingTime": "2017-03-14T15:29-04:00",
  //       "ptc": "ADT",
  //       "refundable": true
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00E",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 265,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "948"
  //         },
  //         "id": "GjLl3ad952OKCLvQ",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LbPo0cB36mGHtvz2",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T20:05-07:00",
  //           "departureTime": "2017-03-14T18:25-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 52,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 45
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 120,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "752"
  //         },
  //         "id": "GdOd4gufznSiAGWc",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LHzg4gUXKiaMlQRv",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T22:50-07:00",
  //           "departureTime": "2017-03-14T20:50-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 120,
  //           "onTimePerformance": 59,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 320,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "755"
  //         },
  //         "id": "GT3dSxjaZbSA6IDK",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L390LBi-TXTrkpGB",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T19:15-07:00",
  //           "departureTime": "2017-03-15T17:10-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 37,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 95
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "810"
  //         },
  //         "id": "Gy85SECHpJN5Rvx9",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LKUDjCjNXQlieNZ3",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T22:30-07:00",
  //           "departureTime": "2017-03-15T20:50-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gy85SECHpJN5Rvx9"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GjLl3ad952OKCLvQ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GT3dSxjaZbSA6IDK"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GdOd4gufznSiAGWc"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T21:24-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00G",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 410,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 105,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "801"
  //         },
  //         "id": "GmFKzy+uzhs7wMOq",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L5DXzoQAQPxwTL8S",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T13:55-07:00",
  //           "departureTime": "2017-03-14T12:10-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 105,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 180
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "746"
  //         },
  //         "id": "GVnvOeaId2O+jOC4",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LhKzgcV23QXFDbtD",
  //           "aircraft": "319",
  //           "arrivalTime": "2017-03-14T19:00-07:00",
  //           "departureTime": "2017-03-14T16:55-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 74,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 320,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "755"
  //         },
  //         "id": "GT3dSxjaZbSA6IDK",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L390LBi-TXTrkpGB",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T19:15-07:00",
  //           "departureTime": "2017-03-15T17:10-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 37,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 95
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "810"
  //         },
  //         "id": "Gy85SECHpJN5Rvx9",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LKUDjCjNXQlieNZ3",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T22:30-07:00",
  //           "departureTime": "2017-03-15T20:50-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gy85SECHpJN5Rvx9"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GmFKzy+uzhs7wMOq"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GT3dSxjaZbSA6IDK"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GVnvOeaId2O+jOC4"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T15:09-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00C",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 265,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "948"
  //         },
  //         "id": "GjLl3ad952OKCLvQ",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LbPo0cB36mGHtvz2",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T20:05-07:00",
  //           "departureTime": "2017-03-14T18:25-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 52,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 45
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 120,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "752"
  //         },
  //         "id": "GdOd4gufznSiAGWc",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LHzg4gUXKiaMlQRv",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T22:50-07:00",
  //           "departureTime": "2017-03-14T20:50-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 120,
  //           "onTimePerformance": 59,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 265,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "751"
  //         },
  //         "id": "GlzSS3QvVYhejpOJ",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LicOBPHkr4RSrt7x",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T09:05-07:00",
  //           "departureTime": "2017-03-15T07:00-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 81,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 40
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "219"
  //         },
  //         "id": "Gtm9u-ke35QalsK5",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LUrW7TC6MuUStZcw",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T11:25-07:00",
  //           "departureTime": "2017-03-15T09:45-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 45,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gtm9u-ke35QalsK5"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GjLl3ad952OKCLvQ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GdOd4gufznSiAGWc"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GlzSS3QvVYhejpOJ"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T21:24-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00B",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 255,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 105,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "801"
  //         },
  //         "id": "GmFKzy+uzhs7wMOq",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L5DXzoQAQPxwTL8S",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T13:55-07:00",
  //           "departureTime": "2017-03-14T12:10-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 105,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 30
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 120,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "345"
  //         },
  //         "id": "GgiFET1htyq5DouQ",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lwe0Q6XWhVtobKUz",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T16:25-07:00",
  //           "departureTime": "2017-03-14T14:25-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 120,
  //           "onTimePerformance": 46,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 265,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "751"
  //         },
  //         "id": "GlzSS3QvVYhejpOJ",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LicOBPHkr4RSrt7x",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T09:05-07:00",
  //           "departureTime": "2017-03-15T07:00-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 81,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 40
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "219"
  //         },
  //         "id": "Gtm9u-ke35QalsK5",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LUrW7TC6MuUStZcw",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T11:25-07:00",
  //           "departureTime": "2017-03-15T09:45-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 45,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gtm9u-ke35QalsK5"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GmFKzy+uzhs7wMOq"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GgiFET1htyq5DouQ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GlzSS3QvVYhejpOJ"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T15:09-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00F",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 410,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 105,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "801"
  //         },
  //         "id": "GmFKzy+uzhs7wMOq",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L5DXzoQAQPxwTL8S",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T13:55-07:00",
  //           "departureTime": "2017-03-14T12:10-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 105,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 180
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "746"
  //         },
  //         "id": "GVnvOeaId2O+jOC4",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LhKzgcV23QXFDbtD",
  //           "aircraft": "319",
  //           "arrivalTime": "2017-03-14T19:00-07:00",
  //           "departureTime": "2017-03-14T16:55-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 74,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 265,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "751"
  //         },
  //         "id": "GlzSS3QvVYhejpOJ",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LicOBPHkr4RSrt7x",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T09:05-07:00",
  //           "departureTime": "2017-03-15T07:00-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 81,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 40
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "219"
  //         },
  //         "id": "Gtm9u-ke35QalsK5",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LUrW7TC6MuUStZcw",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T11:25-07:00",
  //           "departureTime": "2017-03-15T09:45-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 45,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gtm9u-ke35QalsK5"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GmFKzy+uzhs7wMOq"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GVnvOeaId2O+jOC4"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GlzSS3QvVYhejpOJ"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T15:09-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD879.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00D",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 255,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 105,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "801"
  //         },
  //         "id": "GmFKzy+uzhs7wMOq",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 1,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L5DXzoQAQPxwTL8S",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T13:55-07:00",
  //           "departureTime": "2017-03-14T12:10-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 105,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 30
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 120,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "345"
  //         },
  //         "id": "GgiFET1htyq5DouQ",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lwe0Q6XWhVtobKUz",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T16:25-07:00",
  //           "departureTime": "2017-03-14T14:25-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "2",
  //           "duration": 120,
  //           "onTimePerformance": 46,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 320,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 125,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "755"
  //         },
  //         "id": "GT3dSxjaZbSA6IDK",
  //         "cabin": "COACH",
  //         "bookingCode": "E",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L390LBi-TXTrkpGB",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T19:15-07:00",
  //           "departureTime": "2017-03-15T17:10-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "2",
  //           "duration": 125,
  //           "onTimePerformance": 37,
  //           "mileage": 678,
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 95
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 100,
  //         "flight": {
  //          "carrier": "VX",
  //          "number": "810"
  //         },
  //         "id": "Gy85SECHpJN5Rvx9",
  //         "cabin": "COACH",
  //         "bookingCode": "U",
  //         "bookingCodeCount": 7,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LKUDjCjNXQlieNZ3",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-15T22:30-07:00",
  //           "departureTime": "2017-03-15T20:50-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "2",
  //           "duration": 100,
  //           "onTimePerformance": 48,
  //           "mileage": 550,
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "UQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "carrier": "VX",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "EQNR"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "carrier": "VX",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "UQNR"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "Gy85SECHpJN5Rvx9"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "ATLcX6SqQdQK5YB0Togo4XIw3G6BSyPsG9aOU86o",
  //         "segmentId": "GmFKzy+uzhs7wMOq"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GgiFET1htyq5DouQ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AvgTQma2ZQNuwOQ6+acbLx1MOIVgP478yiYtxmJI",
  //         "segmentId": "GT3dSxjaZbSA6IDK"
  //        }
  //       ],
  //       "baseFareTotal": "USD775.80",
  //       "saleFareTotal": "USD775.80",
  //       "saleTaxTotal": "USD103.80",
  //       "saleTotal": "USD879.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD58.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX VX X/SFO 175.81UQNR VX SEA 212.09EQNR VX X/SFO 212.09EQNR VX PDX 175.81UQNR USD 775.80 END ZP PDX SFO SEA SFO XT 58.20US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T15:09-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD991.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00J",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 350,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 112,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "1281"
  //         },
  //         "id": "GB297ZmiIuzWXubR",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L3mzEv2jkR6K2SJH",
  //           "aircraft": "738",
  //           "arrivalTime": "2017-03-14T08:52-07:00",
  //           "departureTime": "2017-03-14T07:00-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 112,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 108
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "322"
  //         },
  //         "id": "G0tyFVbgFF+Kh+Y1",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lk-l78j1J-Xa8aiJ",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-14T12:50-07:00",
  //           "departureTime": "2017-03-14T10:40-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "3",
  //           "duration": 130,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 300,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "816"
  //         },
  //         "id": "GwjGXhUXGxurOqmd",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LNKTsqPZOTPo19ol",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T15:55-07:00",
  //           "departureTime": "2017-03-15T13:45-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 130,
  //           "onTimePerformance": 60,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 61
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 109,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "612"
  //         },
  //         "id": "GYa7AeTJj2Q1LH3g",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LTDHsFnncdYhEIjm",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T18:45-07:00",
  //           "departureTime": "2017-03-15T16:56-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "3",
  //           "duration": 109,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "VAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "VAA0AQEN"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "G0tyFVbgFF+Kh+Y1"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GwjGXhUXGxurOqmd"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GB297ZmiIuzWXubR"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GYa7AeTJj2Q1LH3g"
  //        }
  //       ],
  //       "baseFareTotal": "USD880.00",
  //       "saleFareTotal": "USD880.00",
  //       "saleTaxTotal": "USD111.60",
  //       "saleTotal": "USD991.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD66.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX UA X/SFO 175.81VAA0AQEN UA SEA 264.19HAA0AQEN UA X/SFO 264.19HAA0AQEN UA PDX 175.81VAA0AQEN USD 880.00 END ZP PDX SFO SEA SFO XT 66.00US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T09:59-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD991.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00H",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 333,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 114,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "1217"
  //         },
  //         "id": "GmovsOJgdcKM1NRZ",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 4,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L+Kpe3zFTe3bMWI7",
  //           "aircraft": "319",
  //           "arrivalTime": "2017-03-14T21:34-07:00",
  //           "departureTime": "2017-03-14T19:40-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 114,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 91
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 128,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "351"
  //         },
  //         "id": "G6FphApvmo1X1rZA",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LWUe1x7GFU7L-Vti",
  //           "aircraft": "738",
  //           "arrivalTime": "2017-03-15T01:13-07:00",
  //           "departureTime": "2017-03-14T23:05-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "3",
  //           "duration": 128,
  //           "onTimePerformance": 60,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 300,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "816"
  //         },
  //         "id": "GwjGXhUXGxurOqmd",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LNKTsqPZOTPo19ol",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T15:55-07:00",
  //           "departureTime": "2017-03-15T13:45-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 130,
  //           "onTimePerformance": 60,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 61
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 109,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "612"
  //         },
  //         "id": "GYa7AeTJj2Q1LH3g",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LTDHsFnncdYhEIjm",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T18:45-07:00",
  //           "departureTime": "2017-03-15T16:56-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "3",
  //           "duration": 109,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "VAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "VAA0AQEN"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GwjGXhUXGxurOqmd"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "G6FphApvmo1X1rZA"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GmovsOJgdcKM1NRZ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GYa7AeTJj2Q1LH3g"
  //        }
  //       ],
  //       "baseFareTotal": "USD880.00",
  //       "saleFareTotal": "USD880.00",
  //       "saleTaxTotal": "USD111.60",
  //       "saleTotal": "USD991.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD66.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX UA X/SFO 175.81VAA0AQEN UA SEA 264.19HAA0AQEN UA X/SFO 264.19HAA0AQEN UA PDX 175.81VAA0AQEN USD 880.00 END ZP PDX SFO SEA SFO XT 66.00US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T22:39-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD991.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00K",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 362,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 107,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "1194"
  //         },
  //         "id": "GDjALoXlJ7cWxhlA",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 5,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LxAHdzn952DDbFJn",
  //           "aircraft": "319",
  //           "arrivalTime": "2017-03-14T14:00-07:00",
  //           "departureTime": "2017-03-14T12:13-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 107,
  //           "onTimePerformance": 50,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 125
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "447"
  //         },
  //         "id": "GdWkVF2FOWI-Vj3o",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "Lh40OyzNixuoxHt1",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-14T18:15-07:00",
  //           "departureTime": "2017-03-14T16:05-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "3",
  //           "duration": 130,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 300,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "816"
  //         },
  //         "id": "GwjGXhUXGxurOqmd",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LNKTsqPZOTPo19ol",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T15:55-07:00",
  //           "departureTime": "2017-03-15T13:45-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 130,
  //           "onTimePerformance": 60,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 61
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 109,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "612"
  //         },
  //         "id": "GYa7AeTJj2Q1LH3g",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LTDHsFnncdYhEIjm",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T18:45-07:00",
  //           "departureTime": "2017-03-15T16:56-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "3",
  //           "duration": 109,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "VAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "VAA0AQEN"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GdWkVF2FOWI-Vj3o"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GwjGXhUXGxurOqmd"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GDjALoXlJ7cWxhlA"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GYa7AeTJj2Q1LH3g"
  //        }
  //       ],
  //       "baseFareTotal": "USD880.00",
  //       "saleFareTotal": "USD880.00",
  //       "saleTaxTotal": "USD111.60",
  //       "saleTotal": "USD991.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD66.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX UA X/SFO 175.81VAA0AQEN UA SEA 264.19HAA0AQEN UA X/SFO 264.19HAA0AQEN UA PDX 175.81VAA0AQEN USD 880.00 END ZP PDX SFO SEA SFO XT 66.00US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T15:12-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    },
  //    {
  //     "kind": "qpxexpress#tripOption",
  //     "saleTotal": "USD991.60",
  //     "id": "N8F9j1TMxZ1RUzgeNSIQTJ00I",
  //     "slice": [
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 339,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 109,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "215"
  //         },
  //         "id": "GHvbTn+gkTl2AKtZ",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "0",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LOTQz+4o3y0icyUZ",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-14T07:29-07:00",
  //           "departureTime": "2017-03-14T05:40-07:00",
  //           "origin": "PDX",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 109,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 91
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 139,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "618"
  //         },
  //         "id": "GFYkCrsuUauNoHon",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "1",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "L4Xg4VtmQ4SaKAsh",
  //           "aircraft": "320",
  //           "arrivalTime": "2017-03-14T11:19-07:00",
  //           "departureTime": "2017-03-14T09:00-07:00",
  //           "origin": "SFO",
  //           "destination": "SEA",
  //           "originTerminal": "3",
  //           "duration": 139,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      },
  //      {
  //       "kind": "qpxexpress#sliceInfo",
  //       "duration": 300,
  //       "segment": [
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 130,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "816"
  //         },
  //         "id": "GwjGXhUXGxurOqmd",
  //         "cabin": "COACH",
  //         "bookingCode": "H",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "2",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LNKTsqPZOTPo19ol",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T15:55-07:00",
  //           "departureTime": "2017-03-15T13:45-07:00",
  //           "origin": "SEA",
  //           "destination": "SFO",
  //           "destinationTerminal": "3",
  //           "duration": 130,
  //           "onTimePerformance": 60,
  //           "mileage": 678,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ],
  //         "connectionDuration": 61
  //        },
  //        {
  //         "kind": "qpxexpress#segmentInfo",
  //         "duration": 109,
  //         "flight": {
  //          "carrier": "UA",
  //          "number": "612"
  //         },
  //         "id": "GYa7AeTJj2Q1LH3g",
  //         "cabin": "COACH",
  //         "bookingCode": "V",
  //         "bookingCodeCount": 9,
  //         "marriedSegmentGroup": "3",
  //         "leg": [
  //          {
  //           "kind": "qpxexpress#legInfo",
  //           "id": "LTDHsFnncdYhEIjm",
  //           "aircraft": "739",
  //           "arrivalTime": "2017-03-15T18:45-07:00",
  //           "departureTime": "2017-03-15T16:56-07:00",
  //           "origin": "SFO",
  //           "destination": "PDX",
  //           "originTerminal": "3",
  //           "duration": 109,
  //           "onTimePerformance": 80,
  //           "mileage": 550,
  //           "meal": "Food and Beverages for Purchase",
  //           "secure": true
  //          }
  //         ]
  //        }
  //       ]
  //      }
  //     ],
  //     "pricing": [
  //      {
  //       "kind": "qpxexpress#pricingInfo",
  //       "fare": [
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "PDX",
  //         "destination": "SFO",
  //         "basisCode": "VAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "SEA",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "carrier": "UA",
  //         "origin": "SEA",
  //         "destination": "SFO",
  //         "basisCode": "HAA0AQEN"
  //        },
  //        {
  //         "kind": "qpxexpress#fareInfo",
  //         "id": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "carrier": "UA",
  //         "origin": "SFO",
  //         "destination": "PDX",
  //         "basisCode": "VAA0AQEN"
  //        }
  //       ],
  //       "segmentPricing": [
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GwjGXhUXGxurOqmd"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GHvbTn+gkTl2AKtZ"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AeznxAuDOX1PQuXCJCDpWnCH3QB2AgtaxAu2XYxnCdv6",
  //         "segmentId": "GFYkCrsuUauNoHon"
  //        },
  //        {
  //         "kind": "qpxexpress#segmentPricing",
  //         "fareId": "AUqkjrdO+J92Jm/tfd35NrvMV2KcKrtb3T///Ov75x2w",
  //         "segmentId": "GYa7AeTJj2Q1LH3g"
  //        }
  //       ],
  //       "baseFareTotal": "USD880.00",
  //       "saleFareTotal": "USD880.00",
  //       "saleTaxTotal": "USD111.60",
  //       "saleTotal": "USD991.60",
  //       "passengers": {
  //        "kind": "qpxexpress#passengerCounts",
  //        "adultCount": 1
  //       },
  //       "tax": [
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "US_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "US",
  //         "country": "US",
  //         "salePrice": "USD66.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "AY_001",
  //         "chargeType": "GOVERNMENT",
  //         "code": "AY",
  //         "country": "US",
  //         "salePrice": "USD11.20"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "XF",
  //         "chargeType": "GOVERNMENT",
  //         "code": "XF",
  //         "country": "US",
  //         "salePrice": "USD18.00"
  //        },
  //        {
  //         "kind": "qpxexpress#taxInfo",
  //         "id": "ZP",
  //         "chargeType": "GOVERNMENT",
  //         "code": "ZP",
  //         "country": "US",
  //         "salePrice": "USD16.40"
  //        }
  //       ],
  //       "fareCalculation": "PDX UA X/SFO 175.81VAA0AQEN UA SEA 264.19HAA0AQEN UA X/SFO 264.19HAA0AQEN UA PDX 175.81VAA0AQEN USD 880.00 END ZP PDX SFO SEA SFO XT 66.00US 16.40ZP 11.20AY 18.00XF PDX4.50 SFO4.50 SEA4.50 SFO4.50",
  //       "latestTicketingTime": "2017-03-14T08:39-04:00",
  //       "ptc": "ADT"
  //      }
  //     ]
  //    }
  //   ]
  //  }
  // }
  //
  //
  // res.render('flights/index', {
  //   "query": query,
  //   "response": body,
  // })
  //

  // TEST ABOVE

  request.post({
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestObj),
  }, function(err, response, body){
    console.log("ERR", err);
    console.log("RESPONSE", response);
    body = JSON.parse(body);
    console.log("BODY", body)
    res.render('flights/index', {
      "query": query,
      "response": body,
    })
  })

})


// CHANGE HISTORICAL START AND END DATES
router.post('/historical/:zip', function(req, res){
  var zip = req.params.zip.split('=')[0];
  var name = req.params.zip.split('=')[1];

  var startDate = req.body.historystart;
  var endDate = req.body.historyend;

  req.session.startDate = startDate;
  req.session.endDate = endDate;

  //set db values if logged in
  if(!req.user){

  }else{
    db.user.findById(req.user.id).then(function(user){
      user.update({
        historystart: startDate,
        historyend: endDate
      });
      req.flash('success', 'Travel/history dates updated');
    }).catch(function(error){
      res.send('error', error.message);
    });
  }

  res.redirect('/cities/historical/'+zip+"="+name);

});

module.exports = router;
