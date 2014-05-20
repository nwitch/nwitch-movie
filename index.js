var behest = require('behest');
var omdb = require('omdb');

function plugin() {
  return function(irc) {
    irc.on('message', function(evt) {
      var from = evt.from;
      var to = evt.to;
      var message = evt.message;

      if (!behest.isValid(message)) {
        return;
      }

      var command = behest(message);
      if (command.command === 'movie') {
        var destination = to.charAt(0) === '#' ? to : from;

        omdb.get(command.params.join(' '), function(error, movie) {
          if (error) {
            irc.send(destination, 'Error looking up movie.');
            return;
          }

          if (!movie) {
            irc.send(destination, 'Movie not found.');
            return;
          }

          irc.send(destination, movie.title + ' (' + movie.year + ')');
          irc.send(destination, '| ' + movie.imdb.rating) + '/10';
          irc.send(destination, '| ' + movie.genres.join(', '));
          irc.send(destination, '| http://imdb.com/title/' + movie.imdb.id);
        });
      }
    });
  };
}

module.exports = plugin;