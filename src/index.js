const express = require('express');
const path = require('path');
const session = require('express-session');
const exhbs = require('express-handlebars');
const Handlebars = require('handlebars');
const passport = require('passport');
const flash = require('connect-flash');

// Var inits
const app = express();
require('./dbconnect');

// Settings
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs',
                exhbs({
                    defaultLayout: 'main',
                    layoutsDir: path.join(app.get('views'), 'layouts'),
                    partialsDir: path.join(app.get('views'), 'partials'),
                    extname: '.hbs',
                    helpers: {
                        fillColmenas: function(colmenas){
                            var str = "";
                            colmenas.forEach(colmena => {
                                str += '<tr role=\"row\" data-toggle=\"modal\" id=\"colmena\" value\"'+colmena._id+'\" data-target=\"#infoModal\">'
                                + '<td class=\"sorting_1\" id=\"tag\">'+colmena._id+'</td>'
                                + '<td id=\"alias\">'+colmena.alias+'</td>'
                                + '<td id=\"type\">'+colmena.type+'</td>'
                                + '<td id=\"frames\">'+colmena.frames+'</td>'
                                + '<td id=\"reserveFrame\">'+colmena.reserveFrame+'</td>'
                                + '<td id=\"lastCleanUp\">'+colmena.lastCleanUp+'</td>'
                                + '<td id=\"production\">'+colmena.production+'kg</td>'
                                + '<td id=\"zone_id\" value=\"'+colmena.zone_id+'\">'+colmena.zone_name+'</td>'
                            });

                            return new Handlebars.SafeString(str);
                        },

                        fillZonas: function (zonas) {
                            var str = "";
                            zonas.forEach(zona => {
                                str += '<li data-value=\"'+zona._id+'\">'
                                +'<a href=\"#\">'+zona.zone_name+'</a></li>'
                            });

                            return new Handlebars.SafeString(str);
                        }
                    }
                })
        );

app.set('view engine', '.hbs');

// Middlewares
app.use(express.urlencoded({extended:true}));
app.use(session({
	secret: 'mysecretapp',
	saveUninitialized: true,
	resave: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use(require('./routes/dashboard'));
app.use(require('./routes/colmenas'));
app.use(require('./routes/stats'));

// Static Files
var options = {
    setHeaders: function(res, path, stat) {
        res.set('Service-Worker-Allowed', '/'),
        res.set('Access-Control-Allow-Origin', 'Origin, X-Requested-With, Content-Type, Accept, keep-alive')
    }
};

app.use(express.static(__dirname + '/public', options));

// Server init
server = app.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});

//
io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.on('alert fired', function(from, msg){
    });
});

// Socket listener
const DeviceGPS = require('./models/DeviceGPS');

// Socket init
iocl = require('socket.io-client');
var socketcl = iocl.connect('http://148.217.94.130:80');

socketcl.on('updated', async function(msg){
    var {_id, position, battery, alerta } = msg;
    try {
        const newReg = new DeviceGPS({
            _id: _id,
            position: position,
            battery: battery,
            alert: alerta
        });

        newReg.save( async function(err){
            if (err) {
                const device = await DeviceGPS.findByIdAndUpdate(_id,
                    {
                        $push: {
                            position: {_id: position[0]._id, lat: getLat(position[0].lat), lng: getLng(position[0].lng)},
                        },
                        battery: battery,
                        alert: alerta
                    }
                );
                console.log('Updated');
            } else {
                console.log('Created');
            }
        });

    } catch(e){
        console.error(e);
    }
});

/* Funciones de soporte */
// Conversion del número obtenido por la consulta a un flotante para latitud
function getLat(lat){
    var b = ".";
    var positionLat = 2;
    var outputLat = [lat.slice(0, positionLat), b, lat.slice(positionLat)].join('');
    return outputLat;
}

// Conversion del número obtenido por la consulta a un flotante para latitud
function getLng(lng){
    var b = ".";
    var positionLng = 4;
    var outputLng = [lng.slice(0, positionLng), b, lng.slice(positionLng)].join('');
    return outputLng;
}